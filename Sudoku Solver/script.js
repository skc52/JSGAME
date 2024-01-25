/** @type {HTMLCanvasElement} */
document.addEventListener('DOMContentLoaded', function() {
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d'); // default 300*300

const messageElement = document.getElementById('message');

const CANVAS_WIDTH = canvas.width = 900;
const CANVAS_HEIGHT = canvas.height = 900;
const sqrDimension = CANVAS_HEIGHT / 9;

let hoveredCell = null;
let shouldUpdate = false;

let selectedCell = [-1, -1];

let sudokuArray = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

function drawSquares() {
    for (let i = 0; i < 8; i++) {
        const y = (i + 1) * sqrDimension;

        ctx.lineWidth = (i + 1) % 3 === 0 ? 3 : 1;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();

        // createEditableText(0, y, i, -1); // Create editable text for the row
    }

    for (let i = 0; i < 8; i++) {
        const x = (i + 1) * sqrDimension;

        ctx.lineWidth = (i + 1) % 3 === 0 ? 3 : 1;

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();

        // createEditableText(x, 0, -1, i); // Create editable text for the column
    }
}

function writeNumbers(context) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle'; // Set vertical alignment to middle
    ctx.fillStyle = 'black';
    ctx.font = '40px Helvetica';

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let num = sudokuArray[i][j];
            ctx.fillText(num, j * sqrDimension + sqrDimension / 2, i * sqrDimension + sqrDimension / 2);
        }
    }
}

function createEditableText(x, y, rowIndex, colIndex) {
    const textarea = document.createElement('textarea');
    textarea.style.left = `${x}px`;
    textarea.style.top = `${y}px`;
    
    if (rowIndex !== -1) {
        // Text for the row
        textarea.value = `Row ${rowIndex + 1}`;
    } else {
        // Text for the column
        textarea.value = `Column ${colIndex + 1}`;
    }

    document.body.appendChild(textarea);
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
    ctx.fillStyle = 'rgba(169, 169, 169, 0.5)'; // Set a light gray and slightly transparent background color
    ctx.fillRect(cellX * sqrDimension, cellY * sqrDimension, sqrDimension, sqrDimension);

    // ctx.fillRect(0, 0, 90, 90);

    hoveredCell = { x: cellX, y: cellY };
}
let updated = false;
function animate() {
   


    window.addEventListener('keydown', (e) => {
        // Check if the pressed key is a number from 1 to 9
        const pressedNumber = parseInt(e.key);
    
        if (!isNaN(pressedNumber) && pressedNumber >= 0 && pressedNumber <= 9) {
            // sudokuArray[selected.y][selected.x] = pressedNumber;
            // shouldUpdate = true;
            if (selectedCell[0]!=-1){
                sudokuArray[selectedCell[1]][selectedCell[0]] = pressedNumber;
            }


        }
    });

    
    drawSquares();
    writeNumbers(ctx);

   
    if (selectedCell[0]!=-1){
        ctx.fillStyle = 'rgba(169, 169, 169, 0.1)'; // Set a light gray and slightly transparent background color
        ctx.fillRect(selectedCell[0] * sqrDimension, selectedCell[1] * sqrDimension, sqrDimension, sqrDimension);

    }


    
    requestAnimationFrame(animate);
}



function selectCell(){
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    const cellX = Math.floor(mouseX / sqrDimension);
    const cellY = Math.floor(mouseY / sqrDimension);

    //set previous selected cell to normal color
    ctx.fillStyle = 'white'; // Set a light gray and slightly transparent background color
    ctx.fillRect(selectedCell[0] * sqrDimension, selectedCell[1] * sqrDimension, sqrDimension, sqrDimension);

    if (cellX == selectedCell[0] && cellY == selectedCell[1]){
        selectedCell = [-1, -1];
    }
    else{
        //update the new selected cell
        selectedCell = [cellX, cellY];
        ctx.fillStyle = 'rgba(169, 169, 169, 0.5)'; // Set a light gray and slightly transparent background color
        ctx.fillRect(cellX * sqrDimension, cellY * sqrDimension, sqrDimension, sqrDimension);
    }
}

    

// Add event listener for mouse hover
canvas.addEventListener("mousemove", hoverCells);
canvas.addEventListener("mousedown", selectCell);
animate();


let message = "";


function checkSudoku() {
    // Check rows and columns
    for (let i = 0; i < 9; i++) {
        const rowSet = new Set();
        const colSet = new Set();

        for (let j = 0; j < 9; j++) {
            const rowValue = sudokuArray[i][j];
            const colValue = sudokuArray[j][i];

            // Check if the value is between 1 and 9
            if (rowValue < 1 || rowValue > 9 || colValue < 1 || colValue > 9) {
                console.log("Invalid value in row or column");
                message = "Invalid value in row or column";
                messageElement.textContent = message;

                return false;
            }

            rowSet.add(rowValue);
            colSet.add(colValue);
        }

        if (rowSet.size !== 9 || colSet.size !== 9) {
            console.log("Duplicate values in row or column");
            message = "Duplicate values in row or column";
            messageElement.textContent = message;

            return false;
        }
    }

    // Check 3x3 squares
    for (let i = 0; i < 9; i += 3) {
        for (let j = 0; j < 9; j += 3) {
            const squareSet = new Set();

            for (let k = 0; k < 3; k++) {
                for (let l = 0; l < 3; l++) {
                    const squareValue = sudokuArray[i + k][j + l];

                    // Check if the value is between 1 and 9
                    if (squareValue < 1 || squareValue > 9) {
                        console.log("Invalid value in square");
                        message = "Invalid value in square";
                        messageElement.textContent = message;

                        return false;
                    }

                    squareSet.add(squareValue);
                }
            }

            if (squareSet.size !== 9) {
                console.log("Duplicate values in square");
                message = "Duplicate values in square";
                messageElement.textContent = message;

                return false;
            }
        }
    }

    message = "Sudoku is valid and complete!";
    messageElement.textContent = message;


    return true;
}



function solveSudoku(board) {
    const emptyCell = findEmptyCell(board);

    // If there are no empty cells, the Sudoku is solved
    if (!emptyCell) {
        return true;
    }

    const [row, col] = emptyCell;

    for (let num = 1; num <= 9; num++) {
        if (isValidMove(board, row, col, num)) {
            // Try placing the number
            board[row][col] = num;

            // Recursively attempt to solve the rest of the Sudoku
            if (solveSudoku(board)) {
                return true;
            }

            // If placing the number doesn't lead to a solution, backtrack
            board[row][col] = 0;
        }
    }

    // No valid number was found, backtrack to previous cell
    return false;
}

function findEmptyCell(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                return [row, col];
            }
        }
    }
    return null; // All cells are filled
}

function isValidMove(board, row, col, num) {
    // Check if the number is not in the current row and column
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num) {
            return false;
        }
    }

    // Check if the number is not in the current 3x3 square
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) {
                return false;
            }
        }
    }

    return true;
}

const checkBtn = document.getElementById('check');
checkBtn.addEventListener('click', checkSudoku);

const solveBtn = document.getElementById('solvebtn');
solveBtn.addEventListener('click', ()=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (solveSudoku(sudokuArray)) {
        // Write a text message
        
        messageElement.textContent = 'SOLVED!';
        drawSquares(); // Redraw the squares
        writeNumbers(ctx); // Rewrite the numbers

        
    } else {
        // Handle case where the Sudoku cannot be solved
        messageElement.textContent = 'Sudoku cannot be solved.!';

        
    }
});

});