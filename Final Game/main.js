import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from "./enemies.js";
import { UI } from "./UI.js";
window.addEventListener('load', function(){
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1000;
    canvas.height = 500;

    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.groundMargin = 80;
            this.speed = 0;
            this.maxSpeed = 3;
            this.background = new Background(this)
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            this.enemies = [];
            this.particles = [];
            this.collisions = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.debug = false;
            this.score = 0;
            this.fontColor = 'black';
            this.maxParticles = 50;
            this.time = 0;
            this.maxTime = 200000;
            this.gameOver = false;
            this.lives = 5;
            this.floatingMessages = [];
            
        }

        update(deltaTime){
            this.time+=deltaTime;
            if (this.time > this.maxTime) this.gameOver = true;
            this.background.update();
            this.player.update(this.input.keys, deltaTime);

            //handleEnemies
            if (this.enemyTimer > this.enemyInterval){
                this.addEnemy();
                this.enemyTimer = 0;
            }
            else {
                this.enemyTimer += deltaTime;
            }

            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
                if (enemy.markedForDeletion) this.enemies.splice(this.enemies.indexOf(enemy), 1);
            });
            // handle messages
            this.floatingMessages.forEach((message, index)=>{
                message.update();
            });

            // handle particles
            this.particles.forEach((particle, index) =>{
                particle.update();
                if (particle.markedForDeletion) this.particles.splice(index, 1);
            })

            if (this.particles.length>this.maxParticles){
                this.particles = this.particles.slice(0, this.maxParticles);
            }

            // handle collisions
            this.collisions.forEach((collision, index)=>{
                collision.update(deltaTime);
            })
            this.enemies = this.enemies.filter(enemy=>!enemy.markedForDeletion);
            this.floatingMessages = this.floatingMessages.filter(message=>!message.markedForDeletion);

        }

        draw(ctx){
            this.background.draw(ctx);
            this.player.draw(ctx);
            this.enemies.forEach(enemy => {
                enemy.draw(ctx);
            });
            this.particles.forEach((particle, index) =>{
                particle.draw(ctx);
            });
            this.collisions.forEach((collision, index)=>{
                collision.draw(ctx);
                
            });
            this.floatingMessages.forEach((message, index)=>{
                message.draw(ctx);
            });

            this.UI.draw(ctx);
          
        }

        addEnemy(){
            this.enemies.push(new FlyingEnemy((this)));
            if (this.speed>0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
            else if (this.speed>0) this.enemies.push(new ClimbingEnemy(this));

            console.log(this.enemies);
        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        if (!game.gameOver){
            requestAnimationFrame(animate);
        }
    }

    animate(0);

})