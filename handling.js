//Access the canvas document in the html file
var canvas = document.getElementById("canvas");
var display = canvas.getContext("2d");

//Setup variables
var running = true;
var homescreenLoaded = false;
var onHomescreen = true;
var leaderboardVisible = false;
var instructionsVisible = false;
var selectionVisible = false;
var userVisible = false;
var inputVisible = false;
var homescreenLoopID = 0;
var gameLoopID = 0;

//Initialize images
var homescreenImg, addUserImg, swapUserImg, addUserImg2, swapUserImg2, titleImg;
var easyImg, mediumImg, hardImg, extremeImg, easyImg2, mediumImg2, hardImg2, extremeImg2;
var backgroundImg, leaderboardImg, instructionsImg, userFrameImg, levelsImg;
var playImg, questionImg, trophyImg, userImg, selectionImg, backImg, playImg2, questionImg2, trophyImg2, userImg2, selectionImg2, backImg2;

//Game variables
var win = false;
var lose = false;
var letters = [];
var caught_letters = [];
var basket;
var won = false;
var lost = false;
var timeoutSet = false;
var timeoutID = 0;

//Tracking key movement
let keyd = false;
let key = "";

//Homescreen data
var stringTyped = "";
var changeUser = false;

//Let the document listen for key presses and mouse clicks and movements
document.addEventListener("keydown", function(event){
    if (onHomescreen == false){
        if (event.code == "KeyA" || event.code == "KeyD" || event.key == "ArrowLeft" || event.key == "ArrowRight"){
            keyd = true;
            key = event.code;
        }
    }
    if (event.code === "Escape"){
        //Exit program
        running = false;
        setTimeout(function(){
            clearInterval(homescreenLoopID);
            clearInterval(gameLoopID);
        }, 100);
        
    }
    if (onHomescreen && inputVisible){
        if (event.key === "Backspace"){
            stringTyped = stringTyped.substring(0, stringTyped.length-1);
        }
        else if (event.key === "Enter"){
            inputVisible = false;
            changeUser = true;
        }
        else if (alphabet.includes(event.key)){
            stringTyped+=event.key;
        }
    }
});

document.addEventListener("keyup", function(event){
    if (event.code == key){
        keyd = false;
    }
});

//Handle mouse actions
document.addEventListener("click", handleClicks);
document.addEventListener("mousemove", function(event){
    mouseX = event.clientX;
    mouseY = event.clientY;
});

//Load the images
loadImages();
//Run game
homescreenLoopID = setInterval(handleHomescreen, 20);


//Main game loop
function runGame(){
    //Resize screen if needed
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    //If the game is still being run
    if (running && win == false && lose == false){
        //Handle basket movements and drawing
        basket.draw();
        basket.catch();
        if (keyd == true){
            basket.move(key);
        }

        //Create a string of all caught letters to compare with the game word
        let caughts = "";
        for (let i = 0; i < caught_letters.length; i++){
            caughts+=caught_letters[i].letter;
        }
        
        //Win game if the strings match up
        if (word === caughts){
            win = true;
        }

        //Lose the game if the strings do not match up and are the same length
        if (word != caughts && word.length == caughts.length){
            lose = true;
        }

        //Set the next letter needed
        if (caughts.length >= 1 && caughts.substring(caughts.length - 1, caughts.length) != word.substring(caughts.length-1 , caughts.length)){
            nextLetter = "<";
        }
        else{
            nextLetter = word.substring(caughts.length, caughts.length + 1);
        }

        createLetters();
        draw();
    }

    if (win){
        winGame();
    }

    if (lose){
        loseGame();
    }
    
}

//Create letters to fall
function createLetters(){
    //If the letter probability allows for a letter to be made, create the letter
    let num = Math.floor(Math.random()*letter_probability);
    if (num == 1){
        let l = new Letter();
        if (l.collides == false){
            letters.push(l);
        }
        
    }
    //Search for the needed letter in the list of all letters on the screen
    let found = false;
    for (let i = 0; i < letters.length; i++){
        if (letters[i].letter == nextLetter){
            found = true;
        }
    }
    
    //If needed letter is not falling after a certain number of seconds, spawn the needed letter
    if (found == false){
        timeoutID = setTimeout(function(){
            for (let i = 0; i < letters.length; i++){
                if (letters[i].letter == nextLetter){
                    found = true;
                }
            }
            if (found == false){
                let l = new Letter(nextLetter);
                
                while (l.collides == true){
                    l.x = Math.floor(Math.random()*(canvas.width-this.width+1));
                    l.checkCollision();
                }
                letters.push(l);
            }
        }, letter_spawn_time);
    }
    else{
        //If the letter is found, cancel the timer to spawn the needed letter
        if (timeoutID != 0){
            clearTimeout(timeoutID);
        }
    }
    
    //Make all the letters fall
    for (let i = 0; i < letters.length; i++){
        letters[i].drop();
    }
}

//Draw everything on the game screen
function draw(){
    //Clear the screen
    clear();

    //Draw background imag
    display.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

    //Draw basket
    basket.draw(canvas.height/1.4);
    
    //Draw letters
    for (let i = 0; i < letters.length; i++){
        letters[i].draw();
    }

    //Draw back button
    if (mouseX >= 50 && mouseX <= 50 + backImg.width && mouseY >= canvas.height - backImg.height - 20 && mouseY <= canvas.height- 20){
        display.drawImage(backImg2, 50, canvas.height - backImg.height - 20);
    }else{
        display.drawImage(backImg, 50, canvas.height - backImg.height - 20);
    }
    

    //Draw the game word
    for (let i = 0; i < word.length; i++){
        let caught = false;
        let mistake = false;
        
        //Define if the letter to be shown is in a caught, mistake, or uncaught state
        if (caught_letters[i] != undefined && word[i] == caught_letters[i].letter){
            caught = true;
        }
        else if (caught_letters[i] != undefined && word[i] != caught_letters[i].letter){
            mistake = true;
        
        }
        //Draw the game word on the screen with the images provided in the top middle of the screen, no matter the length of the word
        spacer_width = 10;
        let frameImg = getFrameImg(word[i], caught, mistake);
        let distance_between = i*(frameImg.width + spacer_width);
        let total_width = word.length * frameImg.width;
        let total_spacers = word.length * (frameImg.width + spacer_width) - total_width;
        
        if (total_width + total_spacers >= canvas.width){
            spacer_width = 5;
            distance_between = i*(25 + spacer_width);
            total_width = word.length * 25;
            total_spacers = word.length * (25 + spacer_width) - total_width;
            display.drawImage(frameImg, canvas.width/2 - total_width/2 + distance_between - total_spacers/2, 50, 25, 25);
        }
        else{
            display.drawImage(frameImg, canvas.width/2 - total_width/2 + distance_between - total_spacers/2, 50, 50, 50);
        }
        
        
    }
}

//Initialize confetti object list
var confetti = [];
//Run this when the game is won
function winGame(){
    if (running == false){return;}

    if (won == false){
        //Update scores on the leaderboard
        leaderboard[current_user][0] = leaderboard[current_user][0]+1;
        
        if (difficulty === "Easy"){
            leaderboard[current_user][2] = leaderboard[current_user][2] + 5;
        }
        else if (difficulty === "Medium"){
            leaderboard[current_user][2] = leaderboard[current_user][2] + 15;
        }
        else if (difficulty === "Hard"){
            leaderboard[current_user][2] = leaderboard[current_user][2] + 50;
        }
        else{
            leaderboard[current_user][2] = leaderboard[current_user][2] + 150;
        }
        
        leaderboard_copy[current_user] = leaderboard[current_user];
    }
    //Draw the game screen
    draw();

    //Draw the confetti
    if (confetti.length < max_confetti){
        if (Math.floor(Math.random()*confetti_probability)==0){
            //Make confetti objects if the probability allows
            let cp = new Confetti();
            if (cp.collides == false){
                confetti.push(cp);
            } 
        }
    }
    //Make the confetti fall
    for (let i = 0; i < confetti.length; i++){
        confetti[i].fall();
    }
    //Make sure the points will not be added more than once for a single win
    if (won == false){
        won = true;
    }
}
//Run this when the game is lost
function loseGame(){
    if (running == false){return;}
    //Update leaderboard stats
    if (lost == false){
        leaderboard[current_user][1] = leaderboard[current_user][1]+1;
        leaderboard_copy[current_user] = leaderboard[current_user];
    }
    //Draw the game screen
    draw();
    //Draw lose text
    let LText = display.measureText("Wrong word! Try again");
    display.fillText("Wrong word! Try again", canvas.width/2 - LText.width/2, 400);
    //Make sure the leaderboard stats are not changed more than once for a single loss
    if (lost == false){
        lost = true;
    }
}

//Handle the homescreen functions of the game
function handleHomescreen(){
    //Close the game if it is not meant to be run and change the game size to the screen size
    if (running == false){clear();return;}
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    
    //Set the leaderboard
    if (leaderboard[current_user] == undefined){
        leaderboard[current_user] = [];
        leaderboard[current_user][0] = 0;
        leaderboard[current_user][1] = 0;
        leaderboard[current_user][2] = 0;

        num_users++;
    }
    if (leaderboard_copy[current_user] == undefined){
        for (var key in leaderboard){
            leaderboard_copy[key] = leaderboard[key];
        }
    }

    if (available_users.includes(current_user)){
        available_users.splice(available_users.indexOf(current_user), 1);
    }
    
    ran = false;
    //Order the leaderboard based on points
    orderRankings(leaderboard_copy);

    //Change users if one is typed
    if (users.includes(stringTyped) && leaderboard[stringTyped] != undefined && changeUser == true){
        current_user = stringTyped;
        changeUser = false;
        stringTyped = "";
    }
    //Draw the homescreen
    drawHomescreen();
}

//Run this to draw the homescreen
function drawHomescreen(){
    //Clear and draw the homescreen background image
    clear();
    display.drawImage(homescreenImg, 0, 0, canvas.width, canvas.height);

    //Draw title
    display.drawImage(titleImg, canvas.width/2 - titleImg.width/2, 30);

    //Draw user selection frame
    if (userVisible){
        display.drawImage(userFrameImg, 50, 75);
        display.font = "40px Serif";
        display.fillStyle = "rgb(10,10,10)";

        if (mouseX >= 50 + userFrameImg.width/2 - addUserImg.width/2 && mouseX <= 50 + userFrameImg.width/2 - addUserImg.width/2 + addUserImg.width && mouseY >= 400 && mouseY <= 400 + addUserImg.height){
            display.drawImage(addUserImg2, 50 + userFrameImg.width/2 - addUserImg2.width/2, 400);
        }else{
            display.drawImage(addUserImg, 50 + userFrameImg.width/2 - addUserImg.width/2, 400);
        }
        if (mouseX >= 50 + userFrameImg.width/2 - swapUserImg.width/2 && mouseX <= 50 + userFrameImg.width/2 - swapUserImg.width/2 + swapUserImg.width && mouseY >= 180 && mouseY <= 180 + swapUserImg.height){
            display.drawImage(swapUserImg2, 50+userFrameImg.width/2 - swapUserImg2.width/2, 180);
        }else{2
            display.drawImage(swapUserImg, 50+userFrameImg.width/2 - swapUserImg.width/2, 180);
        }
        
        
        let Ttext = display.measureText("Player Select");
        display.fillText("Player Select", 50 + userFrameImg.width/2 - Ttext.width/2, 140);

        display.font = "25px Serif";

        if (available_users.length < 1){
            let uText = display.measureText("Max users");
            display.fillText("Max users", 50 + userFrameImg.width/2 - uText.width/2, 75+userFrameImg.height - 70);
        }
        
        let userText = display.measureText("Current user: "+current_user);
        display.fillText("Current user: "+current_user, 50 + userFrameImg.width/2 - userText.width/2, 75+userFrameImg.height - 40);

        if (inputVisible){
            drawBorder(50 + userFrameImg.width/2 - (200/2), 280, 200, 60, 2);
            display.fillStyle = "rgb(150,150,150)";
            display.fillRect(50 + userFrameImg.width/2 - (200/2), 280, 200, 60);
            display.fillStyle = "rgb(10,10,10)";
            display.font = "40px Serif";
            let typedText = display.measureText(stringTyped);
            
            if (stringTyped === ""){
                let preText = display.measureText("Enter user");
                display.fillText("Enter user", 50 + userFrameImg.width/2 - preText.width/2, 320, 200);
            }
            if (typedText.width >= 200){
                display.fillText(stringTyped, 50 + userFrameImg.width/2 - (200/2), 320, 200);
            }
            else{
                display.fillText(stringTyped, 50 + userFrameImg.width/2 - typedText.width/2, 320, 200);
            }

        }
    }
    //Draw the level selection frame
    if (selectionVisible){
        display.drawImage(levelsImg, 50, 75);

        //Draw level buttons
        if (difficulty == "Easy" || (mouseX >= 50 + levelsImg.width/2 - easyImg2.width/2 && mouseX <= 50 + levelsImg.width/2 - easyImg2.width/2 + easyImg2.width && mouseY >= 150 && mouseY <= 150 + easyImg2.height)){
            display.drawImage(easyImg2, 50 + levelsImg.width/2 - easyImg2.width/2, 150);
        }
        else{
            display.drawImage(easyImg, 50 + levelsImg.width/2 - easyImg.width/2, 150);
        }
        if (difficulty == "Medium" || (mouseX >= 50 + levelsImg.width/2 - mediumImg2.width && mouseX <= 50 + levelsImg.width/2 - mediumImg2.width/2 + mediumImg2.width && mouseY >= 242 && mouseY <= 242 + mediumImg2.height)){
            display.drawImage(mediumImg2, 50 + levelsImg.width/2 - mediumImg2.width/2, 242);
        }
        else{
            display.drawImage(mediumImg, 50 + levelsImg.width/2 - mediumImg.width/2, 242);
        }
        if (difficulty == "Hard" || (mouseX >= 50 + levelsImg.width/2 - hardImg2.width/2 && mouseX <= 50 + levelsImg.width/2 - hardImg2.width/2 + hardImg2.width && mouseY >= 334 && mouseY <= 334 + hardImg2.height)){
            display.drawImage(hardImg2, 50 + levelsImg.width/2 - hardImg2.width/2, 334);
        }
        else{
            display.drawImage(hardImg, 50 + levelsImg.width/2 - hardImg.width/2, 334);
        }
        if (difficulty == "Extreme" || (mouseX >= 50 + levelsImg.width/2 - extremeImg2.width/2 && mouseX <= 50 + levelsImg.width/2 - extremeImg2.width/2 + extremeImg2.width && mouseY >= 426 && mouseY <= 426 + extremeImg2.height)){
            display.drawImage(extremeImg2, 50 + levelsImg.width/2 - extremeImg2.width/2, 426);
        }
        else{
            display.drawImage(extremeImg, 50 + levelsImg.width/2 - extremeImg.width/2, 426);
        }
    }
    //Draw the leaderboard frame
    if (leaderboardVisible){
        //Draw leaderboard
        display.drawImage(leaderboardImg, canvas.width - 450, 75);

        display.font = "40px Serif"
        display.fillStyle = "rgb(10,10,10)";
        let leaderboardText = display.measureText("Leaderboard");
        display.fillText("Leaderboard", canvas.width-450 + leaderboardImg.width/2 - leaderboardText.width/2, 135);

        display.font = "20px Serif";

        display.fillText("User", canvas.width-450 + 95, 165);
        display.fillText("Points -- Wins : Losses", canvas.width-450 + leaderboardImg.width/2 - 40, 165);
        
        let y_pos = 200;
        let y_add = 50;
        
        for (let i = 0; i < rankings.length; i++){
            if (num_users >= 7){
                display.font = "15px Serif";
                y_add = 30;
            }
            else{
                display.font = "25px Serif";
                y_add = 50;
            }

            display.fillText(rankings[i], canvas.width-450 + 90, y_pos);
            display.fillText(leaderboard[rankings[i]][2] + " -- " + leaderboard[rankings[i]][0] + " : "+leaderboard[rankings[i]][1], canvas.width-450 + leaderboardImg.width/2 + 20, y_pos);

            display.font = "25px Serif";
            let Btext = display.measureText("____________________");
            display.fillText("____________________", canvas.width-450 + leaderboardImg.width/2 - Btext.width/2, y_pos + 5);
            y_pos+=y_add;
        }
        
        let userText = display.measureText("Current user: "+current_user);
        display.fillText("Current user: "+current_user, canvas.width-450 + leaderboardImg.width/2 - userText.width/2, 540);
    }
    //Draw the instructions frame
    if (instructionsVisible){
        //Frame
        display.drawImage(instructionsImg, canvas.width - 450, 75);

        //Text
        display.font = "40px Serif";
        display.fillStyle = "rgb(10,10,10)";
        let Ttext = display.measureText("How To Play");
        display.fillText("How To Play", canvas.width-450 + instructionsImg.width/2 - Ttext.width/2, 135);
        display.font = "20px Serif";
        display.fillText("You are given a word, and as letters", canvas.width - 450 + 40, 75 + 90);
        display.fillText("fall from the sky, you have to catch", canvas.width - 450 + 40, 75 + 115);
        display.fillText("the letters which make up your word", canvas.width - 450 + 40, 75 + 140);
        display.fillText("in your basket.", canvas.width - 450 + 40, 75 + 165);
        
        display.fillText("Watch out - catching the wrong letters", canvas.width - 450 + 40, 75 + 200);
        display.fillText("will cause a miss, and if you finish your", canvas.width - 450 + 40, 75 + 225);
        display.fillText("word with any misses, you lose.", canvas.width - 450 + 40, 75 + 250);

        display.fillText("To remove misses, catch a backspace!", canvas.width - 450 + 40, 75 + 285);
        display.fillText("But be cautious around backspaces, as", canvas.width - 450 + 40, 75 + 310);
        display.fillText("they can also remove correct letters!", canvas.width - 450 + 40, 75 + 335);

        display.fillText("To move your basket, use 'a' for left", canvas.width - 450 + 40, 75 + 370);
        display.fillText("and 'd' for right or use arrow keys", canvas.width - 450 + 40, 75 + 395);

        display.fillText("To stop the program, press escape", canvas.width - 450 + 40, 75 + 430);
    }
    
    //Draw the homescreen buttons
    if (mouseX >= canvas.width/2 - playImg.width/2 && mouseX <= canvas.width/2 - playImg.width/2 + playImg.width && mouseY >= 150 && mouseY <= 150 + playImg.height){
        display.drawImage(playImg2, canvas.width/2 - playImg.width/2, 150);
    }else{
        display.drawImage(playImg, canvas.width/2 - playImg.width/2, 150);
    }
    if (mouseX >= canvas.width/2 + 20 && mouseX <= canvas.width/2 + 20 + trophyImg.width && mouseY >= 350 && mouseY <= 350 + trophyImg.height){
        display.drawImage(trophyImg2, canvas.width/2 + 20, 350);
    }else{
        display.drawImage(trophyImg, canvas.width/2 + 20, 350);
    }
    if (mouseX >= canvas.width/2 - selectionImg.width - 20 && mouseX <= canvas.width/2 - 20 && mouseY >= 350 && mouseY <= 350 + selectionImg.height){
        display.drawImage(selectionImg2, canvas.width/2 - selectionImg2.width - 20, 350);
    }else{
        display.drawImage(selectionImg, canvas.width/2 - selectionImg.width - 20, 350);
    }
    if (mouseX >= canvas.width/2 + 20 && mouseX <= canvas.width/2 + 20 + questionImg.width && mouseY >= 500 && mouseY <= 500 + questionImg.height){
        display.drawImage(questionImg2, canvas.width/2 + 20, 500);
    }else{
        display.drawImage(questionImg, canvas.width/2 + 20, 500);
    }
    if (mouseX >= canvas.width/2 - userImg.width - 20 && mouseX <= canvas.width/2 - 20 && mouseY >= 500 && mouseY <= 500 + userImg.height){
        display.drawImage(userImg2, canvas.width/2 - userImg.width - 20, 500);
    }else{
        display.drawImage(userImg, canvas.width/2 - userImg.width - 20, 500);
    }
    
    homescreenLoaded = true;
}
    
//Handle all clicks
function handleClicks(){
    //Do nothing if the homescreen is not loaded yet
    if (homescreenLoaded == false){return;}

    //Handle the clicks on the back button in the game
    if (onHomescreen == false){
        if (mouseX >= 50 && mouseX <= 50 + backImg.width && mouseY >= canvas.height - backImg.height - 20 && mouseY <= canvas.height - 20){
            onHomescreen = true;
            resetGame();
            homescreenLoopID = setInterval(handleHomescreen, 20);
            
        }
    }

    if (onHomescreen){
        //Handle play button clicks
        if (mouseX >= canvas.width/2 - playImg.width/2 && mouseX <= canvas.width/2 - playImg.width/2 + playImg.width && mouseY >= 150 && mouseY <= 150 + playImg.height){
            //Play the game if the mouse is clicked within the borders of the button
            clearInterval(homescreenLoopID);
            resetGame();
            onHomescreen = false;
            basket = new Basket(canvas.width/2 - canvas.width/16, canvas.height/1.4, 126, 60);
            //Set the difficulty of the game
            if (difficulty == "Easy"){
                word = easy_words[Math.floor(Math.random() * easy_words.length)];
                letter_probability = 41;
            }
            else if (difficulty == "Medium"){
                word = medium_words[Math.floor(Math.random() * medium_words.length)];
                letter_probability = 31;
            }
            else if (difficulty == "Hard"){
                word = hard_words[Math.floor(Math.random() * hard_words.length)];
                letter_probability = 21;
            }
            else if (difficulty == "Extreme"){
                word = extreme_words[Math.floor((Math.random() * extreme_words.length))];
                letter_probability = 11;
            }
            gameLoopID = setInterval(runGame, 20);
        }
        //Handle the leaderboard button
        if (mouseX >= canvas.width/2 + 20 && mouseX <= canvas.width/2 + 20 + selectionImg.width && mouseY >= 350 && mouseY <= 350 + selectionImg.height){
            instructionsVisible = false;
            leaderboardVisible = !leaderboardVisible;
        }
        //Handle the level selection button
        if (mouseX >= canvas.width/2 - trophyImg.width - 20 && mouseX <= canvas.width/2 - 20 && mouseY >= 350 && mouseY <= 350 + trophyImg.height){
            userVisible = false;
            selectionVisible = !selectionVisible;
        }
        //Handle the instructions button
        if (mouseX >= canvas.width/2 +20 && mouseX <= canvas.width/2 + 20 + questionImg.width && mouseY >= 500 && mouseY <= 500 + trophyImg.height){
            leaderboardVisible = false;
            instructionsVisible = !instructionsVisible;
        }
        //Handle the user selection button
        if (mouseX >= canvas.width/2 - userImg.width - 20 && mouseX <= canvas.width/2 - userImg.width - 20 + questionImg.width && mouseY >= 500 && mouseY <= 500 + trophyImg.height){
            selectionVisible = false;
            userVisible = !userVisible;
        }
        //Handle the individual difficulty buttons
        if (selectionVisible){
            //Easy button
            if (mouseX >= 50 + levelsImg.width/2 - easyImg.width/2 && mouseX <= 50 + levelsImg.width/2 - easyImg.width/2 + easyImg.width && mouseY >= 150 && mouseY <= 150 + easyImg.height){
                difficulty = "Easy";
            }
            //Medium button
            if (mouseX >= 50 + levelsImg.width/2 - mediumImg.width/2 && mouseX <= 50 + levelsImg.width/2 - mediumImg.width/2 + mediumImg.width && mouseY >= 242 && mouseY <= 242 + mediumImg.height){
                difficulty = "Medium";
            }
            //Hard button
            if (mouseX >= 50 + levelsImg.width/2 - hardImg.width/2 && mouseX <= 50 + levelsImg.width/2 - hardImg.width/2 + hardImg.width && mouseY >= 334 && mouseY <= 334 + hardImg.height){
                difficulty = "Hard";
            }
            //Extreme button
            if (mouseX >= 50 + levelsImg.width/2 - extremeImg.width/2 && mouseX <= 50 + levelsImg.width/2 - extremeImg.width/2 + extremeImg.width && mouseY >= 426 && mouseY <= 426 + extremeImg.height){
                difficulty = "Extreme";
            }
        }
        //Handle the two different user selection buttons
        if (userVisible){
            //Add user button
            if (mouseX >= 50 + userFrameImg.width/2 - addUserImg.width/2 && mouseX <= 50 + userFrameImg.width/2 - addUserImg.width/2 + addUserImg.width && mouseY >= 400 && mouseY <= 400 + addUserImg.height){
                if (available_users.length > 0){
                    current_user = available_users[Math.floor(Math.random()*available_users.length)];
                }
            }

            //Swap user button
            if (mouseX >= 50 + userFrameImg.width/2 - swapUserImg.width/2 && mouseX <= 50 + userFrameImg.width/2 - swapUserImg.width/2 + swapUserImg.width && mouseY >= 180 && mouseY <= 180 + swapUserImg.height){
                inputVisible = !inputVisible;
                
            }
        }
    }
}
let ran = false;
//Order the leaderboard based on number of points
function orderRankings(leader){
    //If the leaderboard is empty, do nothing
    if (Object.keys(leader).length < 1){
        return;
    }

    if (ran == false){
        rankings = [];
        ran = true;
        
    }

    //Find user with most points
    let max_points = 0;
    let user_key = "";
    for (var key in leader){
        let points = leader[key][2];

        if (points >= max_points){
            max_points = points;
            user_key = key;
        }
    }
    
    if (rankings.includes(user_key)){
        return;
    }

    //Add the highest player into the rankings list
    rankings.push(user_key);
    delete leader[user_key];

    //Use recursion to find the order of the rest of the players
    orderRankings(leader);
}

//Reset the game after a win or loss
function resetGame(){
    clearInterval(gameLoopID);
    letters = [];
    caught_letters = [];
    win = false;
    lose = false;
    won = false;
    lost = false;
    confetti = [];
}
//Draw borders on certain images
function drawBorder(x, y, width, height, thickness){
    display.fillStyle = "rgb(10,10,10)";
    display.fillRect(x - thickness, y - thickness, width + thickness*2, height + thickness*2)
}
//Preload the images to increase efficiency
function loadImages(){
    homescreenImg = new Image();
    homescreenImg.src = "Images/PixelHomescreen.png";

    playImg = new Image();
    playImg.src = "Images/PixelPlay.png";

    questionImg = new Image();
    questionImg.src = "Images/PixelQuestion.png";

    trophyImg = new Image();
    trophyImg.src = "Images/PixelTrophy.png";

    userImg = new Image();
    userImg.src = "Images/PixelUser.png";

    backImg = new Image();
    backImg.src = "Images/PixelBack.png";

    backgroundImg = new Image();
    backgroundImg.src = "Images/PixelBackground.png";

    leaderboardImg = new Image();
    leaderboardImg.src = "Images/PixelLeaderboard.png";

    instructionsImg = new Image();
    instructionsImg.src = "Images/PixelInstructions.png";

    userFrameImg = new Image();
    userFrameImg.src = "Images/PixelUserFrame.png";

    levelsImg = new Image();
    levelsImg.src = "Images/PixelLevels.png";

    selectionImg = new Image();
    selectionImg.src = "Images/PixelSelect.png";

    easyImg = new Image();
    easyImg.src = "Images/PixelEasy.png";

    mediumImg = new Image();
    mediumImg.src = "Images/PixelMedium.png";

    hardImg = new Image();
    hardImg.src = "Images/PixelHard.png";

    extremeImg = new Image();
    extremeImg.src = "Images/PixelExtreme.png";

    easyImg2 = new Image();
    easyImg2.src = "Images/PixelEasy2.png";

    mediumImg2 = new Image();
    mediumImg2.src = "Images/PixelMedium2.png";

    hardImg2 = new Image();
    hardImg2.src = "Images/PixelHard2.png";

    extremeImg2 = new Image();
    extremeImg2.src = "Images/PixelExtreme2.png";

    addUserImg = new Image();
    addUserImg.src = "Images/PixelAddUser.png";

    swapUserImg = new Image();
    swapUserImg.src = "Images/PixelSwapUser.png";

    titleImg = new Image();
    titleImg.src = "Images/PixelTitle.png";

    playImg2 = new Image();
    playImg2.src = "Images/PixelPlay2.png";

    questionImg2 = new Image();
    questionImg2.src = "Images/PixelQuestion2.png";

    trophyImg2 = new Image();
    trophyImg2.src = "Images/PixelTrophy2.png";

    selectionImg2 = new Image();
    selectionImg2.src = "Images/PixelSelect2.png";

    userImg2 = new Image();
    userImg2.src = "Images/PixelUser2.png";

    backImg2 = new Image();
    backImg2.src = "Images/PixelBack2.png";

    addUserImg2 = new Image();
    addUserImg2.src = "Images/PixelAddUser2.png";

    swapUserImg2 = new Image();
    swapUserImg2.src = "Images/PixelSwapUser2.png";

    frameImg = new Image();
}

//Get the letter frame image depending on what letter you need and whether it is in a caught, mistake, or uncaught state
function getFrameImg(letter, caught, mistake){
    let frameImg = new Image();
    if (caught){
        frameImg.src = "Images/Pixel" + letter + "2.png";
    }
    else if (mistake){
        frameImg.src = "Images/Pixel" + letter + "3.png";
    }
    else{
        frameImg.src = "Images/Pixel" + letter + ".png";
    }

    return frameImg;
}

//Clear the screen
function clear(){
    display.clearRect(0,0,canvas.width, canvas.height);
}