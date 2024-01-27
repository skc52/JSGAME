import { Sitiing, Running, Jumping, Falling, Rolling , Diving, Hit} from "./playerState.js";
import { CollisionAnimation } from "./collisionAnimation.js";
import { FloatingMessages } from "./floatingMessages.js";
export class Player {
    constructor(game){
        this.game = game;
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height-this.height-this.game.groundMargin;
        this.vy = 0;
        this.weight = 1;
        this.image = player;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 5;
        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.speed = 0;
        this.maxSpeed = 10;
        this.states = [new Sitiing(this), new Running(this), new Jumping(this), new Falling(this),
        new Rolling(this), new Diving(this), new Hit(this)];
        this.currentState = this.states[0];
        this.currentState.enter();
    }

    update(input, deltaTime){
        this.checkCollision();
        this.currentState.handleInput(input);
        // horizontal movement
        this.x += this.speed;
        if (input.includes('ArrowRight' )) this.speed = this.maxSpeed;
        else if(input.includes('ArrowLeft')) this.speed = -this.maxSpeed;
        else this.speed = 0;

        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width-this.width;

        // vertical movement
        this.y += this.vy;
        if (!this.onGround()) this.vy+=this.weight;
        else this.vy = 0;

        if (this.y > this.game.height-this.height-this.game.groundMargin) this.y = this.game.height-this.height-this.game.groundMargin;

        // sprite animation
        if (this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0; 
        }
        else{
            this.frameTimer+= deltaTime;
        }
        

    }

    draw(ctx){
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        if (this.game.debug){
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
        ctx.drawImage(this.image, this.frameX*this.width, this.frameY*this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }

    onGround(){
        return this.y >= this.game.height-this.height-this.game.groundMargin;
    }

    setState(state, speed){
        this.currentState = this.states[state];
        this.game.speed = this.maxSpeed* speed;
        this.currentState.enter();
    }

    checkCollision(){
        this.game.enemies.forEach(enemy=>{
            if (
                enemy.x < this.x + this.width &&
                enemy.x+this.width>this.x &&
                enemy.y < this.y + this.height &&
                enemy.y+enemy.height > this.y 
            ){
                enemy.markedForDeletion = true;
                this.game.collisions.push(new CollisionAnimation(this.game, enemy.x+enemy.width/2, enemy.y+enemy.height/2));
                if(this.currentState===this.states[4] || this.currentState === this.states[5]){
                    this.game.score++;
                    this.game.floatingMessages.push(new FloatingMessages('+1', enemy.x, enemy.y, 150, 50));
                }
                else{
                    this.setState(6, 0);
                    this.game.lives--;
                    if (this.game.lives <= 0){
                        this.game.gameOver = true;
                    }
                }
            }
            
        })
    }
}