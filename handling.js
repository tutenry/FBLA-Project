//Access the canvas
var canvas = document.getElementById("canvas");
var display = canvas.getContext("2d");

//Setup variables
var running = true;
var homescreenLoaded = false;
var onHomescreen = true;
var leaderboardVisible = false;
var instructionsVisible = false;
var homescreenLoopID = 0;
var gameLoopID = 0;

//Initialize images
var homescreenImg;
var playImg;
var questionImg;
var trophyImg;
var backgroundImg;
var leaderboardImg;
var instructionsImg;

//Game variables
var win = false;
var lose = false;
var letters = [];
var caught_letters = [];
var basket;

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
    
    //TEMPORARY Draw caught letters
    let printString = "";
    for (let i = 0; i < caught_letters.length; i++){
        printString+=caught_letters[i].letter;
    }
    display.fillStyle = "rgb(0,0,0)";
    display.font = "50px Serif";
    display.fillText(printString, 50, 50);

    

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

        let frameImg = getFrameImg(word[i], caught, mistake);
        let distance_between = i*(frameImg.width + spacer_width);
        let total_width = word.length * frameImg.width;
        let total_spacers = word.length * (frameImg.width + spacer_width) - total_width;
        
        
        display.drawImage(frameImg, canvas.width/2 - total_width/2 + distance_between - total_spacers/2, 50, 50, 50);
        
    }
}

var confetti = [];
function winGame(){

    if (running == false){return;}
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
}

function loseGame(){
    if (running == false){return;}
    draw();

    display.fillText("You Lose :(", 500, 500);
}



//Homescreen handling
function handleHomescreen(){
    if (running == false){clear();return;}
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    drawHomescreen();
}



function drawHomescreen(){
    clear();
    display.drawImage(homescreenImg, 0, 0, canvas.width, canvas.height);

    
    if (leaderboardVisible){
        display.drawImage(leaderboardImg, 50, 75);
    }
    if (instructionsVisible){
        display.drawImage(instructionsImg, canvas.width - 450, 75);
        display.font = "50px Serif";
        display.fillText("Instructions", canvas.width-450 + 75, 150, 300);
    }
    
    display.drawImage(playImg, canvas.width/2 - playImg.width/2, 150);
    display.drawImage(trophyImg, canvas.width/2 - trophyImg.width/2, 350);
    display.drawImage(questionImg, canvas.width/2 - questionImg.width/2, 500);

    
    homescreenLoaded = true;
}
    
function handleClicks(){
    
    if (homescreenLoaded == false){return;}

    //Play button
    if (onHomescreen){
        if (mouseX >= canvas.width/2 - playImg.width/2 && mouseX <= canvas.width/2 - playImg.width/2 + playImg.width && mouseY >= 150 && mouseY <= 150 + playImg.height){
            //Play game
            clearInterval(homescreenLoopID);
            onHomescreen = false;
            basket = new Basket(canvas.width/2 - canvas.width/16, canvas.height/1.4, 126, 60);
            gameLoopID = setInterval(runGame, 20);
        }
    }

    if (onHomescreen){
        if (mouseX >= canvas.width/2 - trophyImg.width/2 && mouseX <= canvas.width/2 - trophyImg.width/2 + trophyImg.width && mouseY >= 350 && mouseY <= 350 + trophyImg.height){
            //Toggle leaderboard
            leaderboardVisible = !leaderboardVisible;
        }
    }

    if (onHomescreen){
        if (mouseX >= canvas.width/2 - questionImg.width/2 && mouseX <= canvas.width/2 - questionImg.width/2 + questionImg.width && mouseY >= 500 && mouseY <= 500 + trophyImg.height){
            //Toggle instructions
            instructionsVisible = !instructionsVisible;
        }
    }

    
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

    backgroundImg = new Image();
    backgroundImg.src = "Images/PixelBackground.png";

    leaderboardImg = new Image();
    leaderboardImg.src = "Images/PixelLeaderboard.png";

    instructionsImg = new Image();
    instructionsImg.src = "Images/PixelInstructions.png";

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