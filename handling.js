//Access the canvas
var canvas = document.getElementById("canvas");
var display = canvas.getContext("2d");

//Setup variables
var running = true;
var homescreenLoaded = false;
var onHomescreen = true;
var leaderboardVisible = false;
var instructionsVisible = false;
var selectionVisible = false;
var homescreenLoopID = 0;
var gameLoopID = 0;

//Initialize images
var homescreenImg;
var playImg;
var questionImg;
var trophyImg;
var backImg;
var backgroundImg;
var leaderboardImg;
var instructionsImg;
var levelsImg;
var selectionImg;
var easyImg;
var mediumImg;
var hardImg;
var extremeImg;
var easyImg2;
var mediumImg2;
var hardImg2;
var extremeImg2;

//Game variables
var win = false;
var lose = false;
var letters = [];
var caught_letters = [];
var basket;
var won = false;
var lost = false;

//Tracking key movement
let keyd = false;
let key = "";

document.addEventListener("keydown", function(event){
    if (event.code == "KeyA" || event.code == "KeyD"){
        keyd = true;
        key = event.code;
    }
    if (event.code === "Escape"){
        //Exit program
        running = false;
        setTimeout(function(){
            clearInterval(homescreenLoopID);
            clearInterval(gameLoopID);
        }, 100);
        
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

    
    if (running && win == false && lose == false){
        basket.draw();
        basket.catch();
        if (keyd == true){
            basket.move(key);
        }

        let caughts = "";
        for (let i = 0; i < caught_letters.length; i++){
            caughts+=caught_letters[i].letter;
        }
        
        if (word === caughts){
            win = true;
        }

        if (word != caughts && word.length == caughts.length){
            lose = true;
        }
        
        createLetters();
        draw();
    }

    if (win){
        winGame();
    }

    if (lose){
        //Go back to home screen
        loseGame();
    }
    
}


function createLetters(){
    let num = Math.floor(Math.random()*letter_probability);
    if (num == 1){
        let l = new Letter();
        if (l.collides == false){
            letters.push(l);
        }
        
    }
    
    
    for (let i = 0; i < letters.length; i++){
        letters[i].drop();
    }
}


function draw(){
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
    display.drawImage(backImg, 50, canvas.height - backImg.height - 20);
    
    //TEMPORARY Draw caught letters
    /*
    let printString = "";
    for (let i = 0; i < caught_letters.length; i++){
        printString+=caught_letters[i].letter;
    }
    display.fillStyle = "rgb(0,0,0)";
    display.font = "50px Serif";
    display.fillText(printString, 50, 50);
    */
    

    //Draw word squares
    for (let i = 0; i < word.length; i++){
        
        
        let caught = false;
        let mistake = false;
        
        if (caught_letters[i] != undefined && word[i] == caught_letters[i].letter){
            caught = true;
        }
        else if (caught_letters[i] != undefined && word[i] != caught_letters[i].letter){
            mistake = true;
        }
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

var confetti = [];
function winGame(){

    if (running == false){return;}

    if (won == false){
        leaderboard[current_user][0] = leaderboard[current_user][0]+1;
    }
    

    

    draw();

    if (confetti.length < max_confetti){
        if (Math.floor(Math.random()*confetti_probability)==0){
            //Make confetti
            let cp = new Confetti();
            if (cp.collides == false){
                confetti.push(cp);
            } 
        }
    }
    

    for (let i = 0; i < confetti.length; i++){
        confetti[i].fall();
    }

    if (won == false){
        won = true;
    }
}

function loseGame(){
    if (running == false){return;}

    if (lost == false){
        leaderboard[current_user][1] = leaderboard[current_user][1]+1;
    }

    draw();

    display.fillText("You Lose :(", 500, 500);

    if (lost == false){
        lost = true;
    }
}



//Homescreen handling
function handleHomescreen(){
    if (running == false){clear();return;}
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    if (leaderboard[current_user] == undefined){
        leaderboard[current_user] = [];
        leaderboard[current_user][0] = 0;
        leaderboard[current_user][1] = 0;

        leaderboard_copy[current_user] = [];
        leaderboard_copy[current_user][0] = 0;
        leaderboard_copy[current_user][1] = 0;
    }
    drawHomescreen();
}



function drawHomescreen(){
    clear();
    display.drawImage(homescreenImg, 0, 0, canvas.width, canvas.height);

    if (selectionVisible){
        display.drawImage(levelsImg, 50, 75);

        //Draw level buttons
        if (difficulty == "Easy"){
            display.drawImage(easyImg2, 50 + levelsImg.width/2 - easyImg2.width/2, 150);
        }
        else{
            display.drawImage(easyImg, 50 + levelsImg.width/2 - easyImg.width/2, 150);
        }
        if (difficulty == "Medium"){
            display.drawImage(mediumImg2, 50 + levelsImg.width/2 - mediumImg2.width/2, 242);
        }
        else{
            display.drawImage(mediumImg, 50 + levelsImg.width/2 - mediumImg.width/2, 242);
        }
        if (difficulty == "Hard"){
            display.drawImage(hardImg2, 50 + levelsImg.width/2 - hardImg2.width/2, 334);
        }
        else{
            display.drawImage(hardImg, 50 + levelsImg.width/2 - hardImg.width/2, 334);
        }
        if (difficulty == "Extreme"){
            display.drawImage(extremeImg2, 50 + levelsImg.width/2 - extremeImg2.width/2, 426);
        }
        else{
            display.drawImage(extremeImg, 50 + levelsImg.width/2 - extremeImg.width/2, 426);
        }
    }
    if (leaderboardVisible){
        //Draw leaderboard
        orderRankings(leaderboard_copy);
        display.drawImage(leaderboardImg, canvas.width - 450, 75);

        display.font = "40px Serif"
        let leaderboardText = display.measureText("Leaderboard");
        display.fillText("Leaderboard", canvas.width-450 + leaderboardImg.width/2 - leaderboardText.width/2, 135);

        display.font = "25px Serif";

        let Ttext = display.measureText("User            Wins : Losses");
        display.fillText("User           Wins : Losses", canvas.width-450 + leaderboardImg.width/2 - Ttext.width/2, 180);

        let y_pos = 250;
        for (let i = 0; i < rankings.length; i++){
            let text = display.measureText(rankings[i] + "             " + leaderboard[rankings[i]][0] + " : " + leaderboard[rankings[i]][1]);
            display.fillText(rankings[i] + "             " + leaderboard[rankings[i]][0] + " : " + leaderboard[rankings[i]][1], canvas.width-450 + leaderboardImg.width/2 - text.width/2, y_pos);
            let Btext = display.measureText("_____________________");
            display.fillText("_____________________", canvas.width-450 + leaderboardImg.width/2 - Btext.width/2, y_pos + 10);
            y_pos+=50;
        }
        
        let user = display.measureText("Your user: "+current_user);
        display.fillText("Your user: "+current_user, canvas.width-450 + leaderboardImg.width/2 - user.width/2, 540);
    }
    if (instructionsVisible){
        //Draw instructions
        
        //Frame
        display.drawImage(instructionsImg, canvas.width - 450, 75);

        //Text
        display.font = "40px Serif";
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
        display.fillText("and 'd' for right", canvas.width - 450 + 40, 75 + 395);

        display.fillText("To stop the program, press escape", canvas.width - 450 + 40, 75 + 430);
    }
    
    //Draw buttons
    display.drawImage(playImg, canvas.width/2 - playImg.width/2, 150);
    display.drawImage(trophyImg, canvas.width/2 + 20, 350);
    display.drawImage(selectionImg, canvas.width/2 - selectionImg.width - 20, 350);
    display.drawImage(questionImg, canvas.width/2 - questionImg.width/2, 500);

    
    homescreenLoaded = true;
}
    
function handleClicks(){
    
    if (homescreenLoaded == false){return;}

    //Back button
    if (onHomescreen == false){
        if (mouseX >= 50 && mouseX <= 50 + backImg.width && mouseY >= canvas.height - backImg.height - 20 && mouseY <= canvas.height - 20){
            onHomescreen = true;
            resetGame();
            homescreenLoopID = setInterval(handleHomescreen, 20);
            
        }
    }

    if (onHomescreen){
        //Play button
        if (mouseX >= canvas.width/2 - playImg.width/2 && mouseX <= canvas.width/2 - playImg.width/2 + playImg.width && mouseY >= 150 && mouseY <= 150 + playImg.height){
            //Play game
            clearInterval(homescreenLoopID);
            resetGame();
            onHomescreen = false;
            basket = new Basket(canvas.width/2 - canvas.width/16, canvas.height/1.4, 126, 60);
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

        if (mouseX >= canvas.width/2 + 20 &&mouseX <= canvas.width/2 + 20 + selectionImg.width && mouseY >= 350 && mouseY <= 350 + selectionImg.height){
            //Toggle leaderboard
            instructionsVisible = false;
            leaderboardVisible = !leaderboardVisible;
        }
    
        if (mouseX >= canvas.width/2 - trophyImg.width - 20 && mouseX <= canvas.width/2 - 20 && mouseY >= 350 && mouseY <= 350 + trophyImg.height){
            //Toggle level selection
            selectionVisible = !selectionVisible;
        }
    
        if (mouseX >= canvas.width/2 - questionImg.width/2 && mouseX <= canvas.width/2 - questionImg.width/2 + questionImg.width && mouseY >= 500 && mouseY <= 500 + trophyImg.height){
            //Toggle instructions
            leaderboardVisible = false;
            instructionsVisible = !instructionsVisible;
        }

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
    }
}

function orderRankings(leader){
    if (Object.keys(leader).length < 1){
        return;
    }

    //Find winner
    let max_wins = 0;
    let user_key = "";
    for (var key in leader){
        let wins = leader[key][0];

        if (wins >= max_wins){
            max_wins = wins;
            user_key = key;
        }
    }
    
    if (rankings.includes(user_key)){
        return;
    }
    rankings.push(user_key);
    delete leader[user_key];

    orderRankings(leader);
}

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



function loadImages(){
    homescreenImg = new Image();
    homescreenImg.src = "Images/PixelHomescreen.png";

    playImg = new Image();
    playImg.src = "Images/PixelPlay.png";

    questionImg = new Image();
    questionImg.src = "Images/PixelQuestion.png";

    trophyImg = new Image();
    trophyImg.src = "Images/PixelTrophy.png";

    backImg = new Image();
    backImg.src = "Images/PixelBack.png";

    backgroundImg = new Image();
    backgroundImg.src = "Images/PixelBackground.png";

    leaderboardImg = new Image();
    leaderboardImg.src = "Images/PixelLeaderboard.png";

    instructionsImg = new Image();
    instructionsImg.src = "Images/PixelInstructions.png";

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

    frameImg = new Image();
}

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

function clear(){
    display.clearRect(0,0,canvas.width, canvas.height);
}