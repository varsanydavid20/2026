const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const fireworks = [];
const particles = [];
let time = 0;
let introDone = false;

// ====== FIREWORK ROCKET ======
class Firework {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height;
    this.targetY = Math.random() * canvas.height * 0.4 + 80;
    this.speed = Math.random() * 3 + 4;
    this.exploded = false;
  }

  update() {
    this.y -= this.speed;
    if (this.y <= this.targetY && !this.exploded) {
      this.exploded = true;
      explode(this.x, this.y, 70, false);
    }
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, 2, 8);
  }
}

// ====== PARTICLE ======
class Particle {
  constructor(x, y, angle, speed, color, big = false) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.color = color;
    this.size = big ? 5 : 3;
    this.fade = big ? 0.008 : 0.015;
  }

  update() {
    this.vy += 0.03;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.fade;
  }

  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.globalAlpha = 1;
  }
}

// ====== EXPLOSION ======
function explode(x, y, count, big) {
  const hue = Math.random() * 360;

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 / count) * i;
    const speed = big
      ? Math.random() * 10 + 6
      : Math.random() * 4 + 2;

    const color = `hsl(${hue},100%,60%)`;
    particles.push(new Particle(x, y, angle, speed, color, big));
  }
}

// ====== BIG INTRO EXPLOSION ======
function bigIntroFirework() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      explode(
        centerX,
        centerY,
        300,
        true
      );
    }, i * 250);
  }

  setTimeout(() => {
    introDone = true;
  }, 1800);
}

// ====== TEXT ======
function drawText() {
  const scale = 1 + Math.sin(time * 0.05) * 0.03;

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(scale, scale);

  ctx.font = "bold 200px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.fillText("2026", 0, 0);

  ctx.restore();
}

// ====== MAIN LOOP ======
function loop() {
  time++;

  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawText();

  if (introDone && Math.random() < 0.04) {
    fireworks.push(new Firework());
  }

  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].draw();
    if (fireworks[i].exploded) fireworks.splice(i, 1);
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].alpha <= 0) particles.splice(i, 1);
  }

  requestAnimationFrame(loop);
}

// ====== START ======
bigIntroFirework();
loop();
