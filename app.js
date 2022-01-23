const canvasEl = document.querySelector("canvas");
const canvasContext = canvasEl.getContext("2d");

canvasEl.width = 1500;
canvasEl.height = 720;
// --------------------------------------------------------------------

let RIScore = new Audio();
let AIScore = new Audio();
let hit = new Audio();
let wall = new Audio();

hit.src = "sound/hit.mp3";
wall.src = "sound/wall.mp3";
AIScore.src = "sound/AIScore.mp3";
RIScore.src = "sound/RIScore.mp3";

// the RI player paddle
const playPaddleRI = {
  xP: 0,
  yP: canvasEl.height / 2 - 100 / 2,
  height: 100,
  width: 10,
  color: "#d2e603",
  score: 0,
};

// the AI player paddle
const playPaddleAI = {
  xP: canvasEl.width - 10,
  yP: canvasEl.height / 2 - 100 / 2,
  height: 100,
  width: 10,
  color: "orange",
  score: 0,
};

// creating the ball
const ball = {
  xP: canvasEl.width / 2,
  yP: canvasEl.height / 2,
  radius: 10,
  speed: 7,
  xV: 5,
  yV: 5,
  color: "white",
};

// creating the net
const net = {
  xP: canvasEl.width / 2 - 1,
  yP: 0,
  width: 2,
  height: 10,
  color: "white",
};

// drawing the canvas
function drawRect(xP, yP, width, height, color) {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(xP, yP, width, height);
}

// drawing a circle
function drawCircle(xP, yP, radius, color) {
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(xP, yP, radius, 0, Math.PI * 2);
  canvasContext.fill();
}

// drawing the text
function drawText(content, xP, yP, color) {
  canvasContext.fillStyle = color;
  canvasContext.font = "35px sans-serif";
  canvasContext.fillText(content, xP, yP);
}

// drawing the net
function drawNet() {
  for (let i = 0; i < canvasEl.height; i += 15) {
    drawRect(net.xP, net.yP + i, net.width, net.height, net.color);
  }
}

// runGame function AKA the game loop
function runGame() {
  // clearing the canvas
  drawRect(0, 0, canvasEl.width, canvasEl.height, "#46a3a0");

  // draw net function
  drawNet();

  // draw score function
  drawText(
    playPaddleRI.score,
    (1 * canvasEl.width) / 4,
    (1 * canvasEl.height) / 10,
    "white"
  );
  drawText(
    playPaddleAI.score,
    (3 * canvasEl.width) / 4,
    (1 * canvasEl.height) / 10,
    "white"
  );

  // drawing the paddles for RI and AI
  drawRect(
    playPaddleRI.xP,
    playPaddleRI.yP,
    playPaddleRI.width,
    playPaddleRI.height,
    playPaddleRI.color
  );
  drawRect(
    playPaddleAI.xP,
    playPaddleAI.yP,
    playPaddleAI.width,
    playPaddleAI.height,
    playPaddleAI.color
  );

  // drawing the ball
  drawCircle(ball.xP, ball.yP, ball.radius, ball.color);
}

// the player paddle RI event listener
canvasEl.addEventListener("mousemove", movePaddle);
function movePaddle(e) {
  let canvasRect = canvasEl.getBoundingClientRect();
  playPaddleRI.yP = e.clientY - canvasRect.top - playPaddleRI.height / 2;
}

// the collision detection of paddles function
function paddleCollisDete(BALL, PADDLE) {
  BALL.top = BALL.yP - BALL.radius;
  BALL.bottom = BALL.yP + BALL.radius;
  BALL.left = BALL.xP - BALL.radius;
  BALL.right = BALL.xP + BALL.radius;

  PADDLE.top = PADDLE.yP;
  PADDLE.bottom = PADDLE.yP + PADDLE.height;
  PADDLE.left = PADDLE.xP;
  PADDLE.right = PADDLE.xP + PADDLE.width;

  return (
    BALL.right > PADDLE.left &&
    BALL.bottom > PADDLE.top &&
    BALL.left < PADDLE.right &&
    BALL.top < PADDLE.bottom
  );
}

// the reset ball function
function resetBall() {
  ball.xP = canvasEl.width / 2;
  ball.yP = canvasEl.height / 2;

  ball.speed = 7;
}

// the everything manager function
function everythingManager() {
  // moving the ball by the amount of acceleration
  ball.xP += ball.xV;
  ball.yP += ball.yV;

  // creating AI
  let intelligenceLevel = 0.3;
  playPaddleAI.yP +=
    (ball.yP - (playPaddleAI.yP + playPaddleAI.height / 2)) * intelligenceLevel;

  // bouncing off the top and bottom wall
  if (ball.yP + ball.radius > canvasEl.height || ball.yP - ball.radius < 9) {
    ball.yV = -ball.yV;
    // wall.play();
  }

  let player =
    ball.xP + ball.radius < canvasEl.width / 2 ? playPaddleRI : playPaddleAI;

  if (paddleCollisDete(ball, player)) {
    // hit.play();

    // when the ball hits the paddle of any player
    let collisionPoint = ball.yP - (player.yP + player.height / 2);

    // nomalization => converting -50 & 50 => -1 & 1 & 0
    collisionPoint = collisionPoint / (player.height / 2);

    // calculating the angle at which the bounces back(radius)
    let bounceAngle = (collisionPoint * Math.PI) / 4;

    // calculating the direction of the ball when it bounce back
    let direction = ball.xP + ball.radius < canvasEl.width / 2 ? 1 : -1;

    // updating the velocity when the ball hits any paddle
    ball.xV = direction * ball.speed + Math.cos(bounceAngle);
    ball.yV = direction * ball.speed + Math.sin(bounceAngle);

    // after each bounce back, the speed of the ball should be increased
    ball.speed += 0.1;
  }

  // updating scores
  if (ball.xP + ball.radius < 0) {
    // AI scored
    playPaddleAI.score++;
    // AIScore.play();
    resetBall();
  } else if (ball.xP - ball.radius > canvasEl.width) {
    // RI scored
    playPaddleRI.score++;
    // RIScore.play();
    resetBall();
  }
}

// the game initialization function
function gameInit() {
  everythingManager();
  runGame();
}

// looping the game to keep it running
const FPS = 60;
setInterval(gameInit, 1000 / FPS);
