import { StandingLeft, StandingRight, SiitingLeft, SiitingRight, RunningLeft, RunningRight, JumpingLeft ,JumpingRight
, Fallingleft, FallingRight} from "./state.js";
export default class Player {
    constructor(gameWidth, gameHeight){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.states = [new StandingLeft(this),new StandingRight(this), new SiitingLeft(this), new SiitingRight(this), new RunningLeft(this),
             new RunningRight(this), new JumpingLeft(this), new JumpingRight(this), new Fallingleft(this), new FallingRight(this)];
        this.currentState = this.states[1];
        this.image = document.getElementById("dogImage");

        this.width = 200;
        this.height = 181.83;
        this.x = this.gameWidth/2-this.width/2;
        this.y = this.gameHeight-this.height;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 6;
        this.speed = 0;
        this.maxSpeed = 10;
        this.vy = 0;
        this.weight = 1;
        this.fps = 20;
        this.frameT = 0;
        this.frameInterval = 1000/this.fps;

    }

    draw(context, deltaTime = 0){
        // console.log(this.frameT, deltaTime);

        if (this.frameT > this.frameInterval){
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
            this.frameT = 0;
        }
        else{
            this.frameT += deltaTime;
        }
        
        context.drawImage(this.image, this.frameX*this.width, this.frameY*this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }

    update(input){
        this.currentState.handleInput(input);
        // horizontal boundaries

        this.x+=this.speed;
        if (this.x <= 0) this.x = 0;
        else if (this.x >= this.gameWidth - this.width) this.x = this.gameWidth - this.width;
        //vertical

        this.y+=this.vy;
        if (!this.onGround()){
            this.vy+=this.weight;
        }
        else{
            this.vy = 0;
        }

        if (this.y > this.gameHeight-this.height) this.y = this.gameHeight -this.height;

    }

    setState(state){
        this.currentState = this.states[state]
        this.currentState.enter();
    }

    onGround(){
        return this.y >= this.gameHeight-this.height;
    }
}