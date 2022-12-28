class Confetti{
    constructor(){
        this.width = 30;
        this.height = 10;
        this.x = Math.floor(Math.random()*(canvas.width-this.width + 1));
        this.y = 0 - this.height;
        this.collides = false;

        if (Math.floor(Math.random()*2)==1){
            this.rotation_speed = Math.random()*5;
        }
        else{
            this.rotation_speed = Math.random()*-5;
        }
        this.current_rotation = 0;
        this.starting_angle = Math.random()*360;

        this.randRed = Math.floor(Math.random()*256);
        this.randGreen = Math.floor(Math.random()*256);
        this.randBlue = Math.floor(Math.random()*256);

        this.checkCollision();
    }

    draw(){
        display.fillStyle = "rgb("+this.randRed+"," +this.randGreen+","+ this.randBlue+")";

        display.save();
        display.translate(this.x + this.width/2, this.y + this.height/2);
        let rotation_amount = ((this.rotation_speed + this.current_rotation) * Math.PI / 180)+(this.starting_angle * Math.PI / 180);
        display.rotate(rotation_amount);
        display.translate((this.x + this.width/2) * -1, (this.y + this.height/2)*-1);
        display.fillRect(this.x, this.y, this.width, this.height);
        
        this.current_rotation += this.rotation_speed

        display.restore();
    }

    fall(){
        this.y+=2;
        
        this.draw();

        if (this.y >= canvas.height){
            confetti.splice(confetti.indexOf(this), 1);
        }
    }

    checkCollision(){
        for (let i = 0; i < confetti.length; i++){
            let cp = confetti[i];
            let x_check = false;
            let y_check = false;

            if (cp.x + cp.width >= this.x && cp.x <= this.x + this.width){
                x_check = true;
            }
            if (cp.y >= this.y && cp.y <= this.y + this.height){
                y_check = true;
            }

            if (x_check && y_check){
                this.collides = true;
            }
        }
    }
}