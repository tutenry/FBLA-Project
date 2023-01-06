class Letter {
    constructor(letter){
        this.width = 40;
        this.height = 50;
        this.x = Math.floor(Math.random()*(canvas.width-this.width+1));
        this.y = -this.height;
        
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
        this.collides = false;
        for (let i = 0; i < letters.length; i++){
            let letter = letters[i];
            let x_check = false;
            let y_check = false;

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
        let alphabet2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ<";
        let num = Math.floor(Math.random()*27);
        this.letter = alphabet2[num];
    }
    drop(){
        //Dropping
        this.y += this.speed;

        //Remove letter
        if (this.y >= canvas.height || this.caught == true){
            letters.splice(letters.indexOf(this), 1);
        }
    }

    draw(){
        display.fillStyle = "rgb(10, 10, 10)";
        display.font = "48px Serif";
        display.fillText(this.letter, this.x, this.y, this.width);

        if (show_hitbox == true){
            //Show hitbox
            display.strokeRect(this.x, this.y-this.height, this.width, this.height);
        }
        
    }
    
}