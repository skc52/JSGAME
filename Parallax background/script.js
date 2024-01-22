const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');//default 300*300

const CANVAS_WIDTh = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 700;

let gameSpeed = 5;
const backgroundLayer1 = new Image();
backgroundLayer1.src = 'layer-1.png';
const backgroundLayer2 = new Image();
backgroundLayer2.src = 'layer-2.png';
const backgroundLayer3 = new Image();
backgroundLayer3.src = 'layer-3.png';
const backgroundLayer4 = new Image();
backgroundLayer4.src = 'layer-4.png';
const backgroundLayer5 = new Image();
backgroundLayer5.src = 'layer-5.png';

// windows.addEventListener('load', function(){

    const slider = document.getElementById('slider');
    slider.value = gameSpeed;
    const showGameSpeed = document.getElementById('showGameSpeed');
    showGameSpeed.innerHTML=gameSpeed;

    slider.addEventListener('change', function(e){
        gameSpeed = e.target.value;
        showGameSpeed.innerHTML = e.target.value;
    })

    class Layer {
        constructor(image, speedModifier){
            this.x = 0;
            this.y = 0;
            this.width = 2400;
            this.height = 700;
            // this.x2 = this.width;
            this.image = image;
            this.speedModifier = speedModifier;
            this.speed = gameSpeed * this.speedModifier;
        }

        update(){
            this.speed = gameSpeed*this.speedModifier;
            if (this.x <= -this.width){
                this.x = 0;
            }
        

            this.x = Math.floor(this.x - this.speed);

        }
        draw(){
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x+this.width, this.y, this.width, this.height);

        }
    }

    const layer1 = new Layer(backgroundLayer1, 0.2);

    const layer2 = new Layer(backgroundLayer2, 0.4);

    const layer3 = new Layer(backgroundLayer3, 0.6);
    const layer4 = new Layer(backgroundLayer4, 0.8);
    const layer5 = new Layer(backgroundLayer5, 1);

    const gameObjects = [layer1, layer2, layer3, layer4, layer5];

    function animate(){
        ctx.clearRect(0, 0, CANVAS_WIDTh, CANVAS_HEIGHT);
        gameObjects.forEach((object, index)=>{
            object.update();
            object.draw();
        })
        requestAnimationFrame(animate);
    }

    animate();

// });