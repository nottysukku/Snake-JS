
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

const goback=document.querySelector('.goback');

const upButton = document.querySelector('.upkey');
const downButton = document.querySelector('.downkey');
const leftButton = document.querySelector('.leftkey');
const rightButton = document.querySelector('.rightkey');


const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;


const everythingDiv = document.getElementById('logo');

function draw() {
  board.innerHTML = '';
  drawSnake();
  drawFood();
  updateScore();
}


function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement('div', 'snake');
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}


function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}


function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}


function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}

// Generate food
function generateFood() {
  let x, y;
  do {
    x = Math.floor(Math.random() * gridSize) + 1;
    y = Math.floor(Math.random() * gridSize) + 1;
  } while (snake.some(segment => segment.x === x && segment.y === y));
  return { x, y };
}

// Moving the snake
function move() {
  const head = { ...snake[0] };
  switch (direction) {
    case 'up':
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
    case 'left':
      head.x--;
      break;
    case 'right':
      head.x++;
      break;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval); 
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}


function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  }
}

// Keypress event listener
function handleKeyPress(event) {
  if (!gameStarted && (event.code === 'Space' || event.key === ' ')) {
    startGame();
  }

  if (gameStarted) {
    switch (event.key) {
      case 'ArrowUp':
        if (direction !== 'down') direction = 'up'; 
        break;
      case 'ArrowDown':
        if (direction !== 'up') direction = 'down'; 
        break;
      case 'ArrowLeft':
        if (direction !== 'right') direction = 'left'; 
        break;
      case 'ArrowRight':
        if (direction !== 'left') direction = 'right'; 
        break;
    }
  }
}

document.addEventListener('keydown', handleKeyPress);


upButton.addEventListener('click', () => {
  if (direction !== 'down') direction = 'up';
});
downButton.addEventListener('click', () => {
  if (direction !== 'up') direction = 'down';
});
leftButton.addEventListener('click', () => {
  if (direction !== 'right') direction = 'left';
});
rightButton.addEventListener('click', () => {
  if (direction !== 'left') direction = 'right';
});


everythingDiv.addEventListener('touchstart', (event) => {
  startGame();
  event.preventDefault(); 
}, { passive: true });

function increaseSpeed() {
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

function checkCollision() {
  const head = snake[0];

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = 'right';
  gameSpeedDelay = 200;
  updateScore();
}

function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, '0');
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = 'block';
  logo.style.display = 'block';
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, '0');
  }
  highScoreText.style.display = 'block';
}

const arrowkeyss=document.querySelector('.arrowpress');
arrowkeyss.style.display='none';


function updateInstructionText() {
  const h1 = document.getElementById('instruction-text');
  if (window.innerWidth < 800) {
    h1.textContent = 'Touch the screen to start the game';
    arrowkeyss.style.display='flex';
    
  } else {
    h1.textContent = 'Press Space to start the game';
  }
}


updateInstructionText();


window.addEventListener('resize', updateInstructionText);

goback.addEventListener('click',()=>{
  window.location.href='https://game-site-orpin.vercel.app/';});