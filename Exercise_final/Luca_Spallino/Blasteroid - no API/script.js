const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let score = 0;
let spawnerId;
let bestScore = 0;
let angle = 0; // pot movement

// load sounds
const hitSound = new Audio('assets/hit.mp3');
const killSound = new Audio('assets/kill.mp3');
const overSound = new Audio('assets/over.mp3');
const shootSound = new Audio('assets/shoot.mp3');

// update score
function updateScore() {
  document.getElementById("score-number").textContent = score;
  document.getElementById("best-score-number").textContent = bestScore;
}


class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    const gradient = c.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    gradient.addColorStop(0, "white"); 
    gradient.addColorStop(0.5, "#00BFFF"); 
    gradient.addColorStop(1, "#006400"); // earth gradient //higlight
      
      c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = gradient;
    c.fill();
  }
}

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}


class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = Math.random() * 0.02 - 0.01;
    this.particles = []; // asteroid particles
  }

  draw() {
    const sides = Math.floor(Math.random() * 6 + 8);
    const offset = Math.random() * 5;

    c.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = this.rotation + (i * Math.PI * 2) / sides;
      const xOffset = Math.cos(angle) * (this.radius + (Math.random() - 0.5) * offset);
      const yOffset = Math.sin(angle) * (this.radius + (Math.random() - 0.5) * offset);
      if (i === 0) {
        c.moveTo(this.x + xOffset, this.y + yOffset);
      } else {
        c.lineTo(this.x + xOffset, this.y + yOffset);
      }
    }
    c.closePath();
    c.fillStyle = this.color;
    c.fill();

    // particles asteroid trailes
    if (Math.random() < 0.1) { 
      this.particles.push(
        new Particle(this.x, this.y, Math.random() * 2, this.color, {
          x: Math.random() * 2 - 1,
          y: Math.random() * 2 - 1,
        })
      );
    }

    // update particles
    this.particles.forEach((particle, index) => {
      if (particle.alpha <= 0) {
        this.particles.splice(index, 1);
      } else {
        particle.update();
      }
    });
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.rotation += this.rotationSpeed;
  }
}


const friction = 0.97; // frictioned movement of the explosion (slow down)
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01;
  }
}

const player = new Player(canvas.width / 2, canvas.height / 2, 20, "white");
const projectiles = [];
const enemies = [];
const particles = [];

function spawnEnemies() {
  if (spawnerId) {
    clearInterval(spawnerId); // prevent multiple spawners
  }

  spawnerId = setInterval(() => {
    const radius = Math.random() * (30 - 8) + 8;
    let x, y;

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }

    const color = `hsl(${Math.random() * 360}, 50%, ${Math.random() * 20 + 45}%)`; // color of the enemies
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);

    const velocity = {
      x: Math.cos(angle) * 0.8, // enemies speed
      y: Math.sin(angle) * 0.8, // enemies speed
    };

    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 1700); // enemies number
}

// game over
function showGameOverModal() {
  // if actual score > best score, update best score
  if (score > bestScore) {
    bestScore = score;
  }

  document.getElementById("final-score").textContent = score;
  updateScore();  // update best score
  document.getElementById("game-over-modal").style.display = "flex";
}



// restart game
function restartGame() {
  // hide game over modal
  document.getElementById("game-over-modal").style.display = "none";

  // reset score
  score = 0;
  updateScore();

  // remove everything
  projectiles.length = 0;
  enemies.length = 0;
  particles.length = 0;

  // spawn new enemies, start animations
  spawnEnemies();
  animate();
}

// restart button
document.getElementById("restart-button").addEventListener("click", restartGame);

const stars = [];

// create stars
function generateStars() {
  const numberOfStars = 30; // number 

  for (let i = 0; i < numberOfStars; i++) {
    const x = Math.random() * canvas.width; 
    const y = Math.random() * canvas.height; // random sky
    const size = Math.random() * 2 + 1; // random dimension of the stars (from 1 to 3)
    stars.push({ x, y, size }); 
  }
}

// draw stars
function drawStars() {
  stars.forEach(star => {
    const { x, y, size } = star;
    

    c.beginPath();
    c.moveTo(x - size, y - size); 
    c.lineTo(x + size, y + size); 
    c.moveTo(x - size, y + size); 
    c.lineTo(x + size, y - size); 
    c.strokeStyle = "rgba(247,243,202,255)"; // color
    c.lineWidth = 1; // thickness
    c.stroke();
  });
}

generateStars();


function animate() {
  c.fillStyle = "rgba(0,0,0,0.1)"; // higlight
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();


// shoot indicator
const directionX = player.x + Math.cos(angle) * (player.radius + 10); 
const directionY = player.y + Math.sin(angle) * (player.radius + 10); 

c.beginPath();
c.arc(directionX, directionY, 3, 0, Math.PI * 2, false); 
c.fillStyle = "white"; 
c.fill();

    drawStars(); // stars generator

  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1); // higlight 
    } else {
      particle.update();
    }
  });

  projectiles.forEach((projectile, index) => {
    projectile.update();

    if (projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height) {
      setTimeout(() => {
        projectiles.splice(index, 1); // if the projectile is out of the page, it disappears
      }, 0);
    }
  });

  enemies.forEach((enemy, index) => { // enemy
    enemy.update();

    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

    if (dist - enemy.radius - player.radius < 1) {
      // if enemy touch player
      showGameOverModal(); // game over modal
      overSound.play(); // game over sound
      cancelAnimationFrame(animationId);
    }

    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      if (dist - enemy.radius - projectile.radius < 1) {
        // hit sound
        hitSound.play(); // hit

        // explosions
        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(
            new Particle(projectile.x, projectile.y, Math.random() * 2, enemy.color, {
              x: (Math.random() - 0.5) * (Math.random() * 6), // power of the explosions
              y: (Math.random() - 0.5) * (Math.random() * 6),
            })
          );
        }

        if (enemy.radius - 10 > 5) { // higlight
          score += 100; // 100 points if enemy hitten
          gsap.to(enemy, { radius: enemy.radius - 10 });
          setTimeout(() => {
            projectiles.splice(projectileIndex, 1);
          }, 0);
        } else {
          // kill sound
          killSound.play();
          score += 250; // 250 points if enemy killed
          setTimeout(() => {
            enemies.splice(index, 1); // enemy kill
            projectiles.splice(projectileIndex, 1);
          }, 0);
        }

        updateScore();
      }
    });
  });

  requestAnimationFrame(animate);
}

// higlight 
function updateWebPage(data) {
  const dacVal = 4095; 

  // pot
  const potValue = data[0] / dacVal;

  // pot angle
  angle = potValue * 2 * Math.PI; 

  // button 
  const button = parseInt(data[1]); // extract second data
  if (button === 0) { // if button pressed?
    const velocity = {
      x: Math.cos(angle) * 4,
      y: Math.sin(angle) * 4,
    };
    projectiles.push(new Projectile(player.x, player.y, 5, "white", velocity));
    shootSound.play(); // shoot sound
  }
}

// manage serial data
function handleSerialData(serialData) {
  console.log(serialData);
  updateWebPage(serialData);
}


document.addEventListener("keydown", function(event) {
  if (event.code === "Space") {
    const overlay = document.getElementById("start-overlay");
    overlay.classList.add("hidden"); 

    overlay.addEventListener("transitionend", () => {
      overlay.style.display = "none"; 
    }, { once: true });

    spawnEnemies();
    animate();
  }
});

