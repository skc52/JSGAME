const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = 1400;
canvas.height = 720;

let enemies = [];
let score = 0;
let gameOver = false;

const fullScreenButton = document.getElementById('fullScreenButton');

function toggleFullScreen(){
    if (!document.fullscreenElement){
        canvas.requestFullscreen().catch(err=>{
            alert(`Error, can't enable fullscreen mode: ${err.message}`);
        });
    }
    else{
        document.exitFullscreen();
    }
}

fullScreenButton.addEventListener('click', toggleFullScreen);

class InputHandler {
    constructor() {
        this.keys = [];
        this.touchY = '';
        this.touchThreshold = 30;
        window.addEventListener('keydown', (e) => {
            if ((e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') && this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key);
            }
            else if (e.key === 'Enter' && gameOver) restartGame();
        });

        console.log(this.keys);

        window.addEventListener('keyup', (e) => {
            if ((e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') && this.keys.indexOf(e.key) !== -1) {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        });

        window.addEventListener('touchstart', e=>{
            console.log(e.changedTouches[0].pageY);
            this.touchY = e.changedTouches[0].pageY;
        });
        window.addEventListener('touchmove', e=>{
            const swipeDistance = e.changedTouches[0].pageY-this.touchY;
            if (swipeDistance < -this.touchThreshold && this.keys.indexOf('swipe up') === -1) this.keys.push('swipe up');
            else if (swipeDistance > this.touchThreshold && this.keys.indexOf('swipe down') === -1){
                this.keys.push('swipe down');
                if (gameOver) restartGame();
            }
        });
        window.addEventListener('touchend', e=>{
            this.keys.splice(this.keys.indexOf('swipe up'), 1);
            this.keys.splice(this.keys.indexOf('swipe down'), 1);
        });

    }
}

class Player {
    constructor(gameWidth, gameHeight){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.width = 200;
        this.height = 200;
        this.x = 100;
        this.y = this.gameHeight-this.height;
        this.image = playerImage;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 8;
        this.speed = 0;
        this.vy = 0;
        this.weight = 1;
        this.fps = 20;
        this.frameTimer = 0;
        this.frameInterval = 1000/this.fps;
    }
    restart(){
        this.x = 100;
        this.y = this.gameHeight-this.height;
        this.maxFrame = 8;
        this.frameY  =0;
    }
    draw(context){
        // context.lineWidth = 5;
        // context.strokeStyle = 'white';
        // context.beginPath();
        // context.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI*2)
        // context.stroke();


        context.drawImage(this.image, this.frameX*this.width, this.frameY*this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }

    update(input, deltatime, enemies){
        // collision detection
        enemies.forEach(enemy=>{
            const dx = (enemy.x +enemy.width/2)- (this.x+this.width/2);
            const dy = (enemy.y + enemy.height/2) - (this.y + this.height/2);
            const distance = Math.sqrt(dx*dx+dy*dy);
            if (distance + 10 < enemy.width/2 + this.width/2){
                gameOver = true;
            }
        })

        this.x+=this.speed;
        if (this.frameTimer>this.frameInterval){
            if (this.frameX >= this.maxFrame) this.frameX = 0;
            else this.frameX++;
            this.frameTimer = 0;
        }
        else{
            this.frameTimer += deltatime;
        }
        
        if (input.keys.indexOf('ArrowRight')>-1){
            this.speed = 5;
        }
        else if (input.keys.indexOf('ArrowLeft')>-1){
            this.speed = -5;
        }
        else if ((input.keys.indexOf('ArrowUp')>-1  || (input.keys.indexOf('swipe up')>-1 )) && this.onGround()){
            this.vy = -30;
        }
        else{
            this.speed = 0;
        }

        if (this.x<0) this.x = 0;
        else if (this.x > this.gameWidth-this.width) this.x = this.gameWidth-this.width;

        //vertical movement
        this.y += this.vy;

        if (!this.onGround()){
            this.vy+= this.weight;
            this.maxFrame = 5;
            this.frameY = 1;
        }
        else{
            this.vy = 0;
            this.maxFrame = 8;
            this.frameY = 0;
        }

        if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height;
        
    }

    onGround(){
        return this.y >=this.gameHeight-this.height;
    }
}

class Background {
    constructor(gameWidth, gameHeight){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.image = backgroundImage;
        this.x = 0;
        this.y = 0;
        this.width = 2400;
        this.height = 720;
        this.speed = 5;
    }
    restart(){
        this.x = 0;
    }

    draw(context){
        
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x+this.width-this.speed, this.y, this.width, this.height);
    }

    update(){
        this.x -=this.speed;
        if (this.x < 0-this.width) this.x = 0;
    }
}

class Enemy{
    constructor(gameWidth, gameHeight){
        this.gameHeight = gameHeight;
        this.gameWidth = gameWidth;
        this.width = 160;
        this.height=119;
        this.image = enemyImage;
        this.x = this.gameWidth - 100;
        this.y = this.gameHeight - this.height;
        this.maxFrame = 5;
        this.frameX = 0;
        this.fps = 20;
        this.frameTimer = 0;
        this.frameInterval = 1000/this.fps;
        this.speed = 8;
        this.markedForDeletion = false;
    }

    draw(context){
        // context.lineWidth = 5;
        // context.strokeStyle = 'white';
        // context.beginPath();
        // context.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI*2)
        // context.stroke();


        context.drawImage(this.image, this.frameX* this.width, 0*this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }

    update(deltatime){
        if (this.frameTimer > this.frameInterval){
            if (this.frameX >= this.maxFrame) this.frameX = 0;
            else this.frameX++;
            this.frameTimer = 0;
        }
        else{
            this.frameTimer += deltatime;
        }
       
        this.x-= this.speed;
        if (this.x < 0-this.width){
            this.markedForDeletion = true;
            score++;
        }
    }
}


function handleEnemies(deltatime){
    if (enemyTimer > enemyInterval+randomEnemyInterval){
        enemies.push(new Enemy(canvas.width, canvas.height));
        randomEnemyInterval = Math.random()*1000+500;
        enemyTimer = 0;
    }
    else{
        enemyTimer+=deltatime;
    }
    enemies.forEach(enemy => {
        enemy.draw(ctx);
        enemy.update(deltatime);
    })

    enemies = enemies.filter(enemy => !enemy.markedForDeletion);
}

function displayStatusText(context){
    context.textAlign = 'left';
    context.fillStyle = 'black';
    context.font = '40px Helvetica';
    context.fillText('Score: ' + score, 20, 50);
    context.fillStyle = 'white';
    context.font = '40px Helvetica';
    context.fillText('Score: ' + score, 22, 52);

    if (gameOver){
        context.textAlign = 'center';
        context.fillStyle = 'black';
        context.fillText('GAME OVER! Press ENTER or SWIPE DOWN to restart', canvas.width/2, 200);
        context.fillStyle = 'white';

        context.fillText('GAME OVER! Press ENTER to SWIPE DOWN to restart', canvas.width/2 + 2, 202);
    }
}

function restartGame(){
    player.restart();
    background.restart();
    enemies = [];
    score = 0;
    gameOver = false;
    animate(0);
}

const input = new InputHandler();
const player = new Player(canvas.width, canvas.height);
const background = new Background(canvas.width, canvas.height);


let lastTime = 0;
let enemyTimer = 0;
let enemyInterval =1000;
let randomEnemyInterval = Math.random()*1000+500;
function animate(timeStamp){
    const deltatime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.update();
    background.draw(ctx);
    player.update(input, deltatime, enemies);
    player.draw(ctx);
    handleEnemies(deltatime);
    displayStatusText(ctx);
    if (!gameOver){
        requestAnimationFrame(animate);

    }
}

animate(0);
