import Player from "./Player.js";
import InputHandler from "./input.js";
import { drawStatusText } from "./utils.js";
window.addEventListener('load', function(){


    const loading = this.document.getElementById('loading');
    loading.style.display = 'none';
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = this.window.innerWidth;
    canvas.height = this.window.innerHeight;

    const player = new Player(canvas.width, canvas.height);
    player.draw(ctx);

    const input = new InputHandler();
    
    let lastTime = 0;
    function animate(timeStamp){
        // console.log(input.lastKey);
        const deltaTime = timeStamp-lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0,0,canvas.width, canvas.height);
        player.update(input.lastKey);
        player.draw(ctx, deltaTime);
        drawStatusText(ctx, input, player);
        requestAnimationFrame(animate);
    }

    animate(0);
})