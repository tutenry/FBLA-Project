/*
* This document allows for letters to be created and interacted with in the program
*/

class Letter {
    constructor(letter){
        //Setting up basic attributes
        this.width = 40;
        this.height = 50;
        this.x = Math.floor(Math.random()*(canvas.width-this.width+1));
        this.y = -this.height;
        
        //If there is a specific letter to be created, this defines it
        if (letter){
            this.letter = letter;
        }
        else{
            this.setLetter();
        }
        
        this.speed = 3;

        this.caught = false;
        this.collides = false;
        this.checkCollision();
    }

    

    checkCollision(){
        //This method ensures no letters will be created on the same coordinates on the screen
        //This is to improve quality of the game by not allowing unreachable letters to be created
        this.collides = false;
        for (let i = 0; i < letters.length; i++){
            let letter = letters[i];
            let x_check = false;
            let y_check = false;

            //If the letter is within the boundaries of another letter, state it is colliding
            if (letter.x + letter.width >= this.x && letter.x <= this.x + this.width){
                x_check = true;
            }
            if (letter.y >= this.y && letter.y <= this.y + this.height){
                y_check = true;
            }

            if (x_check && y_check){
                this.collides = true;
            }
        }
    }

    setLetter(){
        //Assign the letter object an alphabetical letter or back arrow
        let alphabet2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ<";
        let num = Math.floor(Math.random()*27);
        this.letter = alphabet2[num];
    }
    drop(){
        //Drop the letter by increasing the y value by a certain speed
        this.y += this.speed;

        //Remove letter from the game if it has fallen past the screen
        if (this.y >= canvas.height || this.caught == true){
            letters.splice(letters.indexOf(this), 1);
        }
    }

    draw(){
        //Draw the letter onto the screen
        display.fillStyle = "rgb(10, 10, 10)";
        display.font = "48px Serif";
        display.fillText(this.letter, this.x, this.y, this.width);

        if (show_hitbox == true){
            //Show hitbox
            display.strokeRect(this.x, this.y-this.height, this.width, this.height);
        }
        
    }
    
}