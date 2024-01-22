/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas1');

const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 500;
const CANVAS_HEIGHT = canvas.height = 1000;
const numberOfEnemies = 100;
const enemiesArray = [];

let gameFrame = 0;
// class Enemy1 {
//     constructor(){
//         this.image = new Image();
//         this.image.src = 'enemy1.png';
        
        
//         // this.speed = Math.random()*4 -2;
//         this.spriteWidth = 293;
//         this.spriteHeight = 155;
//         this.width = this.spriteWidth/2.5;
//         this.height = this.spriteHeight/2.5;
//         this.frame = 0;
//         this.flapSpeed = Math.floor(Math.random()* 3 + 1);

//         this.x = Math.random()*(canvas.width-this.width);
//         this.y = Math.random()*(canvas.height-this.height);

//     }

//     update(){
//         this.x+=Math.random()*5- 2.5;
//         this.y+=Math.random()*5 -2.5;
//         if (gameFrame%this.flapSpeed===0){
//             this.frame > 4 ? this.frame = 0 : this.frame++;
//         }
//     }
//     draw(){
//         ctx.drawImage(this.image, this.frame*this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
//     }
// }

// class Enemy2 {
//     constructor(){
//         this.image = new Image();
//         this.image.src = 'enemy2.png';
        
        
//         this.speed = Math.random()*4 + 1;
//         this.spriteWidth = 266;
//         this.spriteHeight = 188;
//         this.width = this.spriteWidth/2.5;
//         this.height = this.spriteHeight/2.5;
//         this.frame = 0;
//         this.flapSpeed = Math.floor(Math.random()* 3 + 1);

//         this.x = Math.random()*(canvas.width-this.width);
//         this.y = Math.random()*(canvas.height-this.height);
//         this.angle = 0;
//         this.angleSpeed = Math.random()*0.2;
//         this.curve = Math.random()*7;
//     }

//     update(){
//         this.x-=this.speed;
//         this.y += this.curve* Math.sin(this.angle);
//         this.angle+=this.angleSpeed;
//         if (this.x + this.width < 0){
//             this.x = canvas.width;
//         }
//         if (gameFrame%this.flapSpeed===0){
//             this.frame > 4 ? this.frame = 0 : this.frame++;
//         }
//     }
//     draw(){
//         ctx.drawImage(this.image, this.frame*this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
//     }
// }


// class Enemy3 {
//     constructor(){
//         this.image = new Image();
//         this.image.src = 'enemy3.png';
        
        
//         this.speed = Math.random()*4 + 1;
//         this.spriteWidth = 218;
//         this.spriteHeight = 177;
//         this.width = this.spriteWidth/2.5;
//         this.height = this.spriteHeight/2.5;
//         this.frame = 0;
//         this.flapSpeed = Math.floor(Math.random()* 3 + 1);

//         this.x = Math.random()*(canvas.width-this.width);
//         this.y = Math.random()*(canvas.height-this.height);
//         this.angle = 0;
//         this.angleSpeed = Math.random()*2 + 0.5;
//         this.curve = Math.random()*200 + 50;
//     }

//     update(){
//         this.x = this.curve*Math.sin(this.angle*Math.PI/90) + (canvas.width/2 - this.width/2);
//         this.y = this.curve*Math.cos(this.angle*Math.PI/180) + (canvas.height/2 - this.height/2);
//         this.angle+=this.angleSpeed;
//         if (this.x + this.width < 0){
//             this.x = canvas.width;
//         }
//         if (gameFrame%this.flapSpeed===0){
//             this.frame > 4 ? this.frame = 0 : this.frame++;
//         }
//     }
//     draw(){
//         ctx.drawImage(this.image, this.frame*this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
//     }
// }


class Enemy4 {
    constructor(){
        this.image = new Image();
        this.image.src = 'enemy4.png';
        
        
        this.speed = Math.random()*4 + 1;
        this.spriteWidth = 213;
        this.spriteHeight = 213;
        this.width = this.spriteWidth/2.5;
        this.height = this.spriteHeight/2.5;
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random()* 3 + 1);
        this.x = Math.random()*(canvas.width-this.width);
        this.y = Math.random()*(canvas.height-this.height);
        this.newX = Math.random()*(canvas.width-this.width);;
        this.newY = Math.random()*(canvas.height-this.height);
        this.interval = Math.floor(Math.random()*200 + 50);
    }

    update(){
        if (gameFrame%this.interval === 0){
            this.newX = Math.random()*(canvas.width-this.width);;
            this.newY = Math.random()*(canvas.height-this.height);
        }
        let dx = this.x -this.newX;
        let dy = this.y - this.newY;
        this.x -= dx/20;
        this.y -= dy/20;
        if (this.x + this.width < 0){
            this.x = canvas.width;
        }
        if (gameFrame%this.flapSpeed===0){
            this.frame > 4 ? this.frame = 0 : this.frame++;
        }
    }
    draw(){
        ctx.drawImage(this.image, this.frame*this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}




for(let i = 0; i < numberOfEnemies; i++){
    enemiesArray.push(new Enemy4());
}

function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    enemiesArray.forEach(enemy=>{
        enemy.draw();
        enemy.update();
    })
    gameFrame++;
    requestAnimationFrame(animate);
}

animate();