const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

const goback = document.querySelector('.goback');

const upButton = document.querySelector('.upkey');
const downButton = document.querySelector('.downkey');
const leftButton = document.querySelector('.leftkey');
const rightButton = document.querySelector('.rightkey');


const bgmusic = new Audio('https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3');
bgmusic.volume = 0.0;
const point = new Audio ('https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/pause.wav');

const explosion = new Audio ('smb_gameover.wav');
explosion.loop = false;
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let paused = false; // New variable to track pause state

const everythingDiv = document.getElementById('logo');
const highScoreFromLocalStorage = localStorage.getItem('highScore');
if (highScoreFromLocalStorage) {
  			highScore = parseInt(highScoreFromLocalStorage);
  	highScoreText.textContent = highScore.toString().padStart(3, '0'); // Set high score text on load
  	highScoreText.style.display = 'block';
	} else {
  	highScoreText.style.display = 'none'; // Hide if there's no high score
  	}


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

function generateFood() {
  let x, y;
  do {
    x = Math.floor(Math.random() * gridSize) + 1;
    y = Math.floor(Math.random() * gridSize) + 1;
  } while (snake.some(segment => segment.x === x && segment.y === y));
  return { x, y };
}

function move() {
  if (paused) return; // Exit if game is paused
  
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
    point.play();
    
    
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
    bgmusic.play();
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  }
}

function handleKeyPress(event) {
  if (!gameStarted && (event.code === 'Space' || event.key === ' ')) {
    startGame();
  }

  if (gameStarted && !paused) {
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
    snake[0].x = head.x < 1 ? gridSize : head.x > gridSize ? 1 : head.x;
    snake[0].y = head.y < 1 ? gridSize : head.y > gridSize ? 1 : head.y;
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      // Pause the game
      paused = true;
      bgmusic.pause();
 explosion.play();
      document.querySelector('.game-over').style.display = 'block';
      
      setTimeout(() => {
        resetGame();
      }, 1000);
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  
  document.querySelector('.game-over').style.display = 'none';
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
  paused = false; // Reset pause state
  instructionText.style.display = 'block';
  logo.style.display = 'block';
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, '0');
    localStorage.setItem('highScore', highScore);
  }
  highScoreText.style.display = 'block';
}

const arrowkeyss = document.querySelector('.arrowpress');
arrowkeyss.style.display = 'none';

function updateInstructionText() {
  const h1 = document.getElementById('instruction-text');
  if (window.innerWidth < 800) {
    h1.textContent = 'Touch the screen to start the game';
    arrowkeyss.style.display = 'flex';
  } else {
    h1.textContent = 'Press Space to start the game';
  }
}

updateInstructionText();

window.addEventListener('resize', updateInstructionText);

goback.addEventListener('click', () => {
  window.location.href = 'https://game-site-orpin.vercel.app/';
});


