import { Dust, Fire, Splash } from "./particle.js";

const states = {
    SITTING:0,
    RUNNING:1,
    JUMPING:2,
    FALLING:3,
    ROLLING:4,
    DIVING:5,
    HIT:6,
}

class State{
    constructor(state, game){
        this.state = state;
        this.game = game;

    }
}

export class Sitiing extends State{
    constructor(player){
        super('SITTING', player.game);
        this.player = player;
    }

    enter(){
        this.player.frameX = 0;
        this.player.maxFrame = 4;
        this.player.frameY = 5;
    }

    handleInput(input){
        if (input.includes('ArrowLeft') || input.includes('ArrowRight')){
            this.player.setState(states.RUNNING, 1);
        }
        else if (input.includes('Enter')){
            this.player.setState(states.ROLLING, 2);
        }
    }
}

export class Running extends State{
    constructor(player){
        super('RUNNING', player.game);
        this.player = player;
    }

    enter(){
        this.player.frameX = 0;
        this.player.maxFrame = 8;
        this.player.frameY = 3;
    }

    handleInput(input){
        this.game.particles.unshift(new Dust(this.game, this.player.x+this.player.width*0.5, this.player.y+this.player.height));
        if (input.includes('ArrowDown')){
            this.player.setState(states.SITTING, 0);
        }
        else if (input.includes('ArrowUp')){
            this.player.setState(states.JUMPING, 1);
        }
        else if (input.includes('Enter')){
            this.player.setState(states.ROLLING, 2);
        }
    }
}

export class Jumping extends State{
    constructor(player){
        super('JUMPING', player.game);
        this.player = player;
    }

    enter(){
        if (this.player.onGround()) this.player.vy-=27;
        this.player.frameX = 0;
        this.player.frameY = 1;
        this.player.maxFrame = 6;

    }

    handleInput(input){
        if (this.player.vy>this.player.weight){
            this.player.setState(states.FALLING, 1);
        }
        else if (input.includes('Enter')){
            this.player.setState(states.ROLLING, 2);
        } else if (input.includes('ArrowDown')){
            this.player.setState(states.DIVING, 0);

        }
    }
}


export class Falling extends State{
    constructor(player){
        super('FALLING', player.game);
        this.player = player;
    }

    enter(){
        this.player.frameX = 0;
        this.player.frameY = 2;
        this.player.maxFrame = 6;

    }

    handleInput(input){
        if(this.player.onGround()){
            this.player.setState(states.RUNNING, 1);
        }
        else if (input.includes('ArrowDown')){
            this.player.setState(states.DIVING, 0);

        }
    }
}

export class Rolling extends State{
    constructor(player){
        super('ROLLING', player.game);
        this.player = player;
    }

    enter(){
        this.player.frameX = 0;
        this.player.frameY = 6;
        this.player.maxFrame = 6;

    }

    handleInput(input){
        this.game.particles.unshift(new Fire(this.game, this.player.x+this.player.width*0.5, this.player.y+this.player.height*0.5));

        if(!input.includes('Enter') && this.player.onGround()){
            this.player.setState(states.RUNNING, 1);
        } else if (!input.includes('Enter') && !this.player.onGround()){
            this.player.setState(states.FALLING, 1);
        } else if (input.includes('Enter') && input.includes('ArrowUp') && this.player.onGround()){
            this.player.vy-=27;
        }
        else if (input.includes('ArrowDown') && !this.player.onGround()){
            this.player.setState(states.DIVING, 0);

        }
    }
}


export class Diving extends State{
    constructor(player){
        super('DIVING', player.game);
        this.player = player;
    }

    enter(){
        this.player.frameX = 0;
        this.player.frameY = 6;
        this.player.maxFrame = 6;
        this.player.vy = 30;

    }

    handleInput(input){
        this.game.particles.unshift(new Fire(this.game, this.player.x+this.player.width*0.5, this.player.y+this.player.height*0.5));

        if(this.player.onGround()){
            this.player.setState(states.RUNNING, 1);
            for (let i = 0; i < 30; i++){
                this.game.particles.unshift(new Splash(this.game, this.player.x+this.player.width*0.5, this.player.y+this.player.height));

            }
        } else if (input.includes('Enter') && this.player.onGround()){
            this.player.setState(states.ROLLING, 2);
        } 
    }
}


export class Hit extends State{
    constructor(player){
        super('HIT', player.game);
        this.player = player;
    }

    enter(){
        this.player.frameX = 0;
        this.player.frameY = 4;
        this.player.maxFrame = 10;

    }

    handleInput(input){

        if(this.player.frameX>=10 && this.player.onGround()){
            this.player.setState(states.RUNNING, 1);
            
        } else if (this.player.frameX>=10 && !this.player.onGround()){
            this.player.setState(states.FALLING, 1);
        } 
    }
}