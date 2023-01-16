/*
* This document allows for a basket object to be made and handled outside of the main handling document
*/

class Basket {
    constructor(_x, _y, w, h){
        //Setting basic attributes
        this.x = _x;
        this.y = _y;
        this.width = w;
        this.height = h;
    
        this.speed = 0;
        let newImg = new Image();
        newImg.src = "Images/PixelBasket.png";
        this.img = newImg;
    }
    

    draw(y=this.y){
        //Draw the basket onto the screen
        this.y = y;
        display.fillStyle = "red";
        display.drawImage(this.img, this.x, y, this.width, this.height);
        if (show_hitbox == true){
            //Show hitbox
            display.strokeRect(this.x, this.y, this.width, this.height);
        }
        
    }

    move(key){
        //Detect key presses to move the basket in a certain direction
        if (key == "KeyA" || key == "ArrowLeft"){
            if (this.x <= 0){
                return;
            }
            this.speed = -20;
        }
        else{
            if (this.x + this.width >= canvas.width){
                return;
            }
            this.speed = 20;
        }
        this.x+=this.speed;
        
    }

    catch(){
        //Detect collisions with letters to keep track of which letters are meant to be caught
        for (let i = 0; i < letters.length; i++){
            let letter = letters[i];

            let x_check = false;
            let y_check = false;

            //If the letter is within the boundaries of the basket, catch it
            if (letter.x + letter.width >= basket.x && letter.x <= basket.x + basket.width){
                x_check = true;
            }
            if (letter.y >= basket.y && letter.y <= basket.y + basket.height){
                y_check = true;
            }
            if (x_check && y_check && letter.caught == false){
                if (letter.letter == "<"){
                    caught_letters.pop();
                }
                else{
                    caught_letters.push(letter);
                    
                }
                letter.caught = true;
                
            }
        }
    }
}