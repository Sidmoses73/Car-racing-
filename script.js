const gameArea = document.getElementById("gameArea");
const crashSound = document.getElementById("crashSound");
const bgMusic = document.getElementById("bgMusic");
let gameInterval, enemyInterval, scoreInterval;
let tiltMode = false;
let speed = 5;
let score = 0;

function startGame(isTilt = false) {
  tiltMode = isTilt;
  gameArea.innerHTML = `
    <div id="playerCar" class="car"></div>
    <div id="scoreBoard">Score: 0</div>
  `;
  bgMusic.play();
  score = 0;
  speed = 5;

  const car = document.getElementById("playerCar");
  let carLeft = 175;

  // Create road lines
  const lines = [];
  for (let i = 0; i < 6; i++) {
    const line = document.createElement("div");
    line.classList.add("line");
    line.style.top = `${i * 100}px`;
    gameArea.appendChild(line);
    lines.push(line);
  }

  const enemies = [];

  function createEnemy() {
    const enemy = document.createElement("div");
    enemy.classList.add("car", "enemyCar");
    enemy.style.left = `${Math.floor(Math.random() * 350)}px`;
    enemy.style.top = "-100px";
    gameArea.appendChild(enemy);
    enemies.push(enemy);
  }

  document.onkeydown = function (e) {
    if (!tiltMode) {
      if (e.key === "ArrowLeft" && carLeft > 0) {
        carLeft -= 10;
      } else if (e.key === "ArrowRight" && carLeft < 350) {
        carLeft += 10;
      }
      car.style.left = carLeft + "px";
    }
  };

  if (tiltMode) {
    window.addEventListener("deviceorientation", (event) => {
      const gamma = event.gamma;
      if (gamma < -5 && carLeft > 0) carLeft -= 5;
      if (gamma > 5 && carLeft < 350) carLeft += 5;
      car.style.left = carLeft + "px";
    });
  }

  function updateGame() {
    // Move lines
    lines.forEach(line => {
      let top = parseInt(line.style.top);
      top += speed;
      if (top > 600) top = -100;
      line.style.top = top + "px";
    });

    // Move enemies
    enemies.forEach((enemy, i) => {
      let top = parseInt(enemy.style.top);
      top += speed;
      enemy.style.top = top + "px";
      if (top > 600) {
        enemy.remove();
        enemies.splice(i, 1);
      }

      // Collision Detection
      const carRect = car.getBoundingClientRect();
      const enemyRect = enemy.getBoundingClientRect();
      if (
        !(carRect.right < enemyRect.left ||
          carRect.left > enemyRect.right ||
          carRect.bottom < enemyRect.top ||
          carRect.top > enemyRect.bottom)
      ) {
        endGame();
      }
    });

    // Increase speed every 100 points
    if (score > 0 && score % 100 === 0) speed += 0.5;
  }

  function updateScore() {
    score += 1;
    document.getElementById("scoreBoard").innerText = `Score: ${score}`;
  }

  function endGame() {
    clearInterval(gameInterval);
    clearInterval(enemyInterval);
    clearInterval(scoreInterval);
    crashSound.play();
    bgMusic.pause();
    alert(`Game Over! Your score: ${score}`);
    location.reload();
  }

  gameInterval = setInterval(updateGame, 30);
  enemyInterval = setInterval(createEnemy, 1500);
  scoreInterval = setInterval(updateScore, 100);
}
