var canvas = document.getElementById("canvas");

var display = canvas.getContext("2d");

display.fillStyle ="red";

var basket = new Basket(canvas.width/2 - canvas.width/16, canvas.height/1.4, 126, 60);


let keyd = false;
let key = "";
var running = true;
var win = false;
var lose = false;
var letters = [];
document.addEventListener("keydown", function(event){
    if (event.code == "KeyA" || event.code == "KeyD"){
        keyd = true;
        key = event.code;
    }
    if (event.code === "Escape"){
        //Exit program
        running = false;
    }
});

document.addEventListener("keyup", function(event){
    if (event.code == key){
        keyd = false;
    }
});

handleHomescreen();



let caught_letters = [];

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

    //Draw background image
    let backgroundImg = new Image();
    backgroundImg.src = "Images/PixelBackground.png"
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
    display.fillStyle = "rgb(0,0,0)"
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

        let img = getFrameImg(word[i], caught, mistake);
        let distance_between = i*(img.width + spacer_width);
        let total_width = word.length * img.width;
        let total_spacers = word.length * (img.width + spacer_width) - total_width;
        
        
        display.drawImage(img, canvas.width/2 - total_width/2 + distance_between - total_spacers/2, 50, 50, 50);
        
    }
}

var confetti = [];
function winGame(){

    if (running == false){return;}
    draw();

    if (confetti.length < max_confetti){
        if (Math.floor(Math.random()*3)==1){
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

function clear(){
    display.clearRect(0,0,canvas.width, canvas.height);
}

function getFrameImg(letter, caught, mistake){
    let img = new Image();

    if (caught){
        img.src = "Images/Pixel" + letter + "2.png";
    }
    else if (mistake){
        img.src = "Images/Pixel" + letter + "3.png";
    }
    else{
        img.src = "Images/Pixel" + letter + ".png";
    }
    return img;
}

function handleHomescreen(){
    drawHomescreen();

    /*if (running == true){
        setInterval(runGame, 20);
    }
    */
}



function drawHomescreen(){
    clear();
    let img = new Image();
    img.src = "Images/PixelHomescreen.png";

    display.drawImage(img, 0, 0, canvas.width, canvas.height);
    console.log("drawing");
}
    