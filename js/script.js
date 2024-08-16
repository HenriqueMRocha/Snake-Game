const canvas = document.querySelector('.game__canvas');
const ctx = canvas.getContext('2d');
const size = 30;
const audio = new Audio('../assets/audio.mp3');
const score = document.querySelector('.game__score-value');
const finalScore = document.querySelector('.game__menu-score > span');
const menu = document.querySelector('.game__menu');
const buttonPlay = document.querySelector('.game__button-play');

const initialPosition = { x: 150, y: 150 };
let snake = [initialPosition];

const incrementScore = () => {
    score.innerText = Number(score.innerText) + 10;
};

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
};

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size);
    return Math.round(number / 30) * 30;
};

const randomColor = () => {
    const red = randomNumber(0, 255);
    const green = randomNumber(0, 255);
    const blue = randomNumber(0, 255);
    return `rgb(${red}, ${green}, ${blue})`;
};

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
};

const drawFood = () => {
    const { x, y, color } = food;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    ctx.shadowBlur = 0;
};

const drawSnake = () => {
    ctx.fillStyle = '#ddd';
    snake.forEach((position, index) => {
        if (index === snake.length - 1) {
            ctx.fillStyle = 'white';
        }
        ctx.fillRect(position.x, position.y, size, size);
    });
};

let direction, loopId;

const moveSnake = () => {
    if (!direction) return;

    const head = snake[snake.length - 1];

    if (direction === "right") {
        snake.push({ x: head.x + size, y: head.y });
    }

    if (direction === "left") {
        snake.push({ x: head.x - size, y: head.y });
    }

    if (direction === "up") {
        snake.push({ x: head.x, y: head.y - size });
    }

    if (direction === "down") {
        snake.push({ x: head.x, y: head.y + size });
    }

    snake.shift();
};

const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#444";

    for (let i = 30; i < canvas.width; i += size) {
        ctx.beginPath();
        ctx.lineTo(i, 0);
        ctx.lineTo(i, 600);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineTo(0, i);
        ctx.lineTo(600, i);
        ctx.stroke();
    }
};

const checkEat = () => {
    const head = snake[snake.length - 1];

    if (head.x === food.x && head.y === food.y) {
        incrementScore();
        snake.push(head);
        audio.play();

        let x = randomPosition();
        let y = randomPosition();

        while (snake.find((position) => position.x === x && position.y === y)) {
            x = randomPosition();
            y = randomPosition();
        }

        food.x = x;
        food.y = y;
        food.color = randomColor();
    }
};

const checkCollision = () => {
    const head = snake[snake.length - 1];
    const canvasLimit = canvas.width - size;
    const neckIndex = snake.length - 2;
    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;
    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x === head.x && position.y === head.y;
    });

    if (wallCollision || selfCollision) {
        gameOver();
    }
};

const gameOver = () => {
    direction = undefined;
    menu.style.display = 'flex';
    finalScore.innerText = score.innerText;
    canvas.style.filter = "blur(5px)";
};

const gameLoop = () => {
    // Essa linha a seguir é uma segurança a mais para sempre limpar o loop. As vezes pode ocorrer de o browser rodar dois loops diferentes e executar estranho.
    clearInterval(loopId);
    // No canvas, para fazer um movimento, é necessario limpar a tela antes, se não irá ficar um desenho gigante, então essa função serve para limpar e desenhar novamente
    ctx.clearRect(0, 0, 600, 600);
    drawFood();
    drawGrid();
    moveSnake();
    drawSnake();
    checkEat();
    checkCollision();

    loopId = setTimeout(() => {
        gameLoop();
    }, 100);
};

gameLoop();

document.addEventListener("keydown", ({ key }) => {
    if (key === 'ArrowRight' && direction !== 'left') {
        direction = 'right';
    }

    if (key === 'ArrowLeft' && direction !== 'right') {
        direction = 'left';
    }

    if (key === 'ArrowUp' && direction !== 'down') {
        direction = 'up';
    }

    if (key === 'ArrowDown' && direction !== 'up') {
        direction = 'down';
    }
});

buttonPlay.addEventListener('click', () => {
    score.innerText = '00';
    menu.style.display = 'none';
    canvas.style.filter = 'none';
    snake = [initialPosition];
});