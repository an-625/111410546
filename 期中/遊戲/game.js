const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;

let snake;
let food;
let direction;
let nextDirection;
let score;
let game;
let running = false;

function initGame() {

    snake = [
        { x: 10 * box, y: 10 * box }
    ];

    direction = "RIGHT";
    nextDirection = "RIGHT";

    food = randomFood();

    score = 0;

    document.getElementById("score").innerText = score;
}

function randomFood() {

    return {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box
    };
}

document.addEventListener("keydown", handleKey);

function handleKey(event) {

    const key = event.key.toLowerCase();

    if (key === "enter") {

        if (!running) {
            startGame();
        }

        return;
    }

    if (
        (key === "arrowup" || key === "w") &&
        direction !== "DOWN"
    ) {
        nextDirection = "UP";
    }

    if (
        (key === "arrowdown" || key === "s") &&
        direction !== "UP"
    ) {
        nextDirection = "DOWN";
    }

    if (
        (key === "arrowleft" || key === "a") &&
        direction !== "RIGHT"
    ) {
        nextDirection = "LEFT";
    }

    if (
        (key === "arrowright" || key === "d") &&
        direction !== "LEFT"
    ) {
        nextDirection = "RIGHT";
    }
}

function drawGrid() {

    ctx.strokeStyle = "#111";

    for (let i = 0; i < 20; i++) {

        ctx.beginPath();
        ctx.moveTo(i * box, 0);
        ctx.lineTo(i * box, 400);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * box);
        ctx.lineTo(400, i * box);
        ctx.stroke();
    }
}

function draw() {

    direction = nextDirection;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 400, 400);

    drawGrid();

    for (let i = 0; i < snake.length; i++) {

        ctx.fillStyle = i === 0 ? "#00ffcc" : "#00aa88";

        ctx.shadowBlur = 10;
        ctx.shadowColor = "#00ffcc";

        ctx.fillRect(
            snake[i].x,
            snake[i].y,
            box,
            box
        );
    }

    ctx.shadowBlur = 20;
    ctx.shadowColor = "red";

    ctx.fillStyle = "red";

    ctx.beginPath();

    ctx.arc(
        food.x + 10,
        food.y + 10,
        8,
        0,
        Math.PI * 2
    );

    ctx.fill();

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "UP") snakeY -= box;
    if (direction === "DOWN") snakeY += box;
    if (direction === "LEFT") snakeX -= box;
    if (direction === "RIGHT") snakeX += box;

    if (
        snakeX === food.x &&
        snakeY === food.y
    ) {

        score++;

        document.getElementById("score").innerText = score;

        food = randomFood();

    } else {

        snake.pop();
    }

    const newHead = {
        x: snakeX,
        y: snakeY
    };

    if (
        snakeX < 0 ||
        snakeY < 0 ||
        snakeX >= 400 ||
        snakeY >= 400 ||
        collision(newHead, snake)
    ) {

        clearInterval(game);

        running = false;

        gameOver();

        return;
    }

    snake.unshift(newHead);
}

function collision(head, array) {

    for (let i = 0; i < array.length; i++) {

        if (
            head.x === array[i].x &&
            head.y === array[i].y
        ) {
            return true;
        }
    }

    return false;
}

function startGame() {

    clearInterval(game);

    initGame();

    running = true;

    game = setInterval(draw, 100);
}

async function gameOver() {

    setTimeout(async () => {

        const name = prompt(
            `遊戲結束！\n你的分數：${score}\n請輸入名字：`
        );

        if (name) {

            await fetch("/score", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    score
                })
            });
        }

        loadLeaderboard();

    }, 100);
}

async function loadLeaderboard() {

    const response = await fetch("/leaderboard");

    const data = await response.json();

    const leaderboard =
        document.getElementById("leaderboard");

    leaderboard.innerHTML = "";

    data.forEach((player, index) => {

        const li = document.createElement("li");

        li.innerText =
            `${index + 1}. ${player.name} - ${player.score}`;

        leaderboard.appendChild(li);
    });
}

loadLeaderboard();
