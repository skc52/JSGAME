/** @type {HTMLCanvasElement} */

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d'); // default 300*300

const CANVAS_WIDTH = canvas.width = 900;
const CANVAS_HEIGHT = canvas.height = 900;
const sqrDimension = CANVAS_HEIGHT / 9;

let hoveredCell = null;
let shouldUpdate = false;

function drawSquares() {
    for (let i = 0; i < 8; i++) {
        const y = (i + 1) * sqrDimension;

        ctx.lineWidth = (i + 1) % 3 === 0 ? 3 : 1;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
    }

    for (let i = 0; i < 8; i++) {
        const x = (i + 1) * sqrDimension;

        ctx.lineWidth = (i + 1) % 3 === 0 ? 3 : 1;

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
    }
}

// Add hover effect to cells
function hoverCells(event) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    const cellX = Math.floor(mouseX / sqrDimension);
    const cellY = Math.floor(mouseY / sqrDimension);
    console.log(cellX, cellY);
    if (hoveredCell !== null) {
        // Reset color for the previously hovered cell
        ctx.fillStyle = "#ffffff"; // Set the background color to white
        ctx.fillRect(
            hoveredCell.x * sqrDimension,
            hoveredCell.y * sqrDimension,
            sqrDimension,
            sqrDimension
        );
    }

    // Apply hover effect to the current cell
    ctx.fillStyle = 'black'; // Set a light gray background color
    ctx.fillRect(cellX * sqrDimension, cellY * sqrDimension, sqrDimension, sqrDimension);
    // ctx.fillRect(0, 0, 90, 90);

    hoveredCell = { x: cellX, y: cellY };
}

function animate() {
    if (shouldUpdate){
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
    drawSquares();
    requestAnimationFrame(animate);
}

// Add event listener for mouse hover
canvas.addEventListener("mousemove", hoverCells);

animate();
