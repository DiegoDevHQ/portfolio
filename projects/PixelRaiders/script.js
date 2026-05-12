const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const waveEl = document.getElementById("wave");
const livesEl = document.getElementById("lives");
const bestEl = document.getElementById("best");
const shardsEl = document.getElementById("shards");
const comboEl = document.getElementById("combo");
const storyTextEl = document.getElementById("storyText");
const objectiveTextEl = document.getElementById("objectiveText");
const meterLabelEl = document.getElementById("meterLabel");
const bossMeterEl = document.getElementById("bossMeter");
const runLogEl = document.getElementById("runLog");
const upgradeListEl = document.getElementById("upgradeList");
const messageEl = document.getElementById("message");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");

const keys = new Set();
const W = canvas.width;
const H = canvas.height;

const storyBeats = [
  "Signal traces show the first swarm entering sector 01. Secure enough points to stabilize the breach.",
  "The drowned arcade is reacting. Drones are routing power to deeper sectors.",
  "Heat signatures suggest heavier units in the ruins. Upgrade before the next push.",
  "A titan signal has surfaced. Crack its core before it floods the arena with swarm noise.",
  "The city is learning your patterns. Keep your combo alive or you will get buried in attrition.",
  "The breach is almost stable. One more clean sequence and the raid can be extracted."
];

const upgrades = [
  {
    id: "thrusters",
    name: "Overclock Thrusters",
    description: "+0.35 movement speed for tighter strafing.",
    baseCost: 60,
    max: 4,
    apply() {
      state.player.speedBase += 0.35;
    }
  },
  {
    id: "reactor",
    name: "Pulse Reactor",
    description: "Fire faster by shaving one frame off auto-shot cooldown.",
    baseCost: 75,
    max: 5,
    apply() {
      state.player.fireInterval = Math.max(4, state.player.fireInterval - 1);
    }
  },
  {
    id: "prism",
    name: "Prism Rounds",
    description: "+1 damage, wider projectiles, and one extra pierce.",
    baseCost: 95,
    max: 3,
    apply() {
      state.player.damage += 1;
      state.player.bulletSize += 0.8;
      state.player.pierce += 1;
    }
  },
  {
    id: "phase",
    name: "Phase Armor",
    description: "+1 life and one shield charge that absorbs a hit.",
    baseCost: 110,
    max: 3,
    apply() {
      state.lives = Math.min(7, state.lives + 1);
      state.player.shield += 1;
    }
  },
  {
    id: "recycler",
    name: "Scrap Recycler",
    description: "+2 shards from every defeated enemy.",
    baseCost: 90,
    max: 4,
    apply() {
      state.salvageBonus += 2;
    }
  },
  {
    id: "capacitor",
    name: "Dash Capacitor",
    description: "Shorter dash cooldown and longer invulnerable burst.",
    baseCost: 80,
    max: 4,
    apply() {
      state.dashMax = Math.max(36, state.dashMax - 10);
      state.player.dashFramesMax += 2;
    }
  }
];

const state = {
  running: false,
  paused: false,
  score: 0,
  best: Number(localStorage.getItem("pixel-raiders-best") || 0),
  wave: 1,
  lives: 3,
  shards: 0,
  combo: 1,
  comboTimer: 0,
  cooldown: 0,
  spawnCooldown: 0,
  dashCooldown: 0,
  dashMax: 86,
  salvageBonus: 0,
  waveStartScore: 0,
  nextWaveScore: 260,
  bossSpawned: false,
  logs: [],
  particles: [],
  bullets: [],
  enemies: [],
  upgradeLevels: Object.fromEntries(upgrades.map((upgrade) => [upgrade.id, 0])),
  player: {
    x: W / 2,
    y: H / 2,
    r: 14,
    speedBase: 3.35,
    dashFrames: 0,
    dashFramesMax: 10,
    invulnFrames: 0,
    fireInterval: 10,
    bulletSpeed: 7.2,
    bulletSize: 4.2,
    damage: 1,
    pierce: 0,
    shield: 0
  }
};

bestEl.textContent = String(state.best);

function logMessage(text) {
  state.logs.unshift(text);
  state.logs = state.logs.slice(0, 6);
  runLogEl.innerHTML = state.logs
    .map((entry) => `<div class="log-item"><strong>Signal</strong><div>${entry}</div></div>`)
    .join("");
}

function upgradeCost(upgrade) {
  return upgrade.baseCost + state.upgradeLevels[upgrade.id] * 22;
}

function resetRuntimeValues() {
  state.running = true;
  state.paused = false;
  state.score = 0;
  state.wave = 1;
  state.lives = 3;
  state.shards = 0;
  state.combo = 1;
  state.comboTimer = 0;
  state.cooldown = 0;
  state.spawnCooldown = 30;
  state.dashCooldown = 0;
  state.dashMax = 86;
  state.salvageBonus = 0;
  state.waveStartScore = 0;
  state.nextWaveScore = 260;
  state.bossSpawned = false;
  state.logs = [];
  state.particles = [];
  state.bullets = [];
  state.enemies = [];
  state.upgradeLevels = Object.fromEntries(upgrades.map((upgrade) => [upgrade.id, 0]));
  state.player.x = W / 2;
  state.player.y = H / 2;
  state.player.speedBase = 3.35;
  state.player.dashFrames = 0;
  state.player.dashFramesMax = 10;
  state.player.invulnFrames = 0;
  state.player.fireInterval = 10;
  state.player.bulletSpeed = 7.2;
  state.player.bulletSize = 4.2;
  state.player.damage = 1;
  state.player.pierce = 0;
  state.player.shield = 0;
  pauseBtn.textContent = "Pause";
  messageEl.textContent = "Run active. Farm shards, protect your combo, and prep for titan waves.";
  storyTextEl.textContent = storyBeats[0];
  objectiveTextEl.textContent = "Stabilize Sector 01";
  meterLabelEl.textContent = "Wave pressure";
  logMessage("Boot sequence complete. Breach open.");
  logMessage("Harvest 260 points to break into sector 02.");
}

function syncHud() {
  scoreEl.textContent = String(state.score);
  waveEl.textContent = String(state.wave);
  livesEl.textContent = String(state.lives);
  shardsEl.textContent = String(state.shards);
  comboEl.textContent = `x${state.combo.toFixed(1)}`;
  bestEl.textContent = String(Math.max(state.best, state.score));

  const boss = state.enemies.find((enemy) => enemy.boss);
  if (boss) {
    objectiveTextEl.textContent = `Break Titan Core · ${Math.max(0, Math.ceil(boss.hp))} HP`;
    meterLabelEl.textContent = "Titan integrity";
    bossMeterEl.style.width = `${Math.max(0, (boss.hp / boss.maxHp) * 100)}%`;
  } else {
    const progress = Math.min(1, Math.max(0, (state.score - state.waveStartScore) / (state.nextWaveScore - state.waveStartScore)));
    const remaining = Math.max(0, state.nextWaveScore - state.score);
    objectiveTextEl.textContent = `Earn ${remaining} points to breach sector ${String(state.wave + 1).padStart(2, "0")}`;
    meterLabelEl.textContent = "Wave pressure";
    bossMeterEl.style.width = `${progress * 100}%`;
  }
}

function renderUpgrades() {
  upgradeListEl.innerHTML = "";
  upgrades.forEach((upgrade) => {
    const level = state.upgradeLevels[upgrade.id];
    const cost = upgradeCost(upgrade);
    const maxed = level >= upgrade.max;

    const card = document.createElement("article");
    card.className = "upgrade-card";
    card.dataset.upgradeId = upgrade.id;
    card.innerHTML = `
      <header>
        <div>
          <strong>${upgrade.name}</strong>
          <div class="upgrade-meta">Level ${level}/${upgrade.max}</div>
        </div>
        <strong>${maxed ? "MAX" : `${cost} shards`}</strong>
      </header>
      <p>${upgrade.description}</p>
      <button class="buy-upgrade">${maxed ? "Maxed Out" : "Buy Upgrade"}</button>
    `;

    const button = card.querySelector("button");
    button.disabled = maxed || !state.running || cost > state.shards;
    button.addEventListener("click", () => purchaseUpgrade(upgrade.id));
    upgradeListEl.appendChild(card);
  });
}

function refreshUpgradeButtons() {
  upgrades.forEach((upgrade) => {
    const card = upgradeListEl.querySelector(`[data-upgrade-id="${upgrade.id}"]`);
    if (!card) return;
    const button = card.querySelector("button");
    if (!button) return;
    const level = state.upgradeLevels[upgrade.id];
    const maxed = level >= upgrade.max;
    const cost = upgradeCost(upgrade);
    const shouldDisable = maxed || !state.running || cost > state.shards;
    if (button.disabled !== shouldDisable) {
      button.disabled = shouldDisable;
    }
  });
}

function purchaseUpgrade(id) {
  const upgrade = upgrades.find((item) => item.id === id);
  if (!upgrade) return;
  const level = state.upgradeLevels[upgrade.id];
  if (!state.running || level >= upgrade.max) return;

  const cost = upgradeCost(upgrade);
  if (cost > state.shards) return;

  state.shards -= cost;
  state.upgradeLevels[upgrade.id] += 1;
  upgrade.apply();
  logMessage(`${upgrade.name} installed.`);
  messageEl.textContent = `${upgrade.name} online.`;
  renderUpgrades();
  syncHud();
}

function spawnEnemy() {
  const side = Math.floor(Math.random() * 4);
  let x = 0;
  let y = 0;

  if (side === 0) {
    x = -24;
    y = Math.random() * H;
  }
  if (side === 1) {
    x = W + 24;
    y = Math.random() * H;
  }
  if (side === 2) {
    x = Math.random() * W;
    y = -24;
  }
  if (side === 3) {
    x = Math.random() * W;
    y = H + 24;
  }

  const bossWave = state.wave % 4 === 0;
  if (bossWave && !state.bossSpawned) {
    state.bossSpawned = true;
    state.enemies.push({
      x,
      y,
      r: 34,
      hp: 28 + state.wave * 2,
      maxHp: 28 + state.wave * 2,
      speed: 1.08,
      color: "#ffb84d",
      boss: true,
      wobble: Math.random() * Math.PI * 2,
      scoreValue: 260,
      shardValue: 55
    });
    logMessage("Titan signature confirmed.");
    messageEl.textContent = "Boss wave. Break the titan core.";
    return;
  }

  const rolls = [
    {
      threshold: 0.45,
      r: 12 + Math.random() * 4,
      hp: 2 + Math.floor(state.wave * 0.55),
      speed: 1.35 + Math.random() * 0.8,
      color: "#ff4d8d",
      scoreValue: 24,
      shardValue: 8
    },
    {
      threshold: 0.8,
      r: 16 + Math.random() * 5,
      hp: 4 + Math.floor(state.wave * 0.75),
      speed: 1 + Math.random() * 0.45,
      color: "#ff8b5c",
      scoreValue: 40,
      shardValue: 12
    },
    {
      threshold: 1,
      r: 10 + Math.random() * 3,
      hp: 3 + Math.floor(state.wave * 0.65),
      speed: 1.85 + Math.random() * 0.85,
      color: "#8b5cf6",
      scoreValue: 32,
      shardValue: 10
    }
  ];

  const pick = Math.random();
  const type = rolls.find((entry) => pick <= entry.threshold) || rolls[0];

  state.enemies.push({
    x,
    y,
    r: type.r,
    hp: type.hp,
    maxHp: type.hp,
    speed: type.speed + state.wave * 0.045,
    color: type.color,
    boss: false,
    wobble: Math.random() * Math.PI * 2,
    scoreValue: type.scoreValue,
    shardValue: type.shardValue
  });
}

function shootAtClosest() {
  if (!state.enemies.length) return;

  let target = state.enemies[0];
  let bestDistance = Infinity;
  state.enemies.forEach((enemy) => {
    const distance = Math.hypot(enemy.x - state.player.x, enemy.y - state.player.y);
    if (distance < bestDistance) {
      bestDistance = distance;
      target = enemy;
    }
  });

  const angle = Math.atan2(target.y - state.player.y, target.x - state.player.x);
  state.bullets.push({
    x: state.player.x,
    y: state.player.y,
    vx: Math.cos(angle) * state.player.bulletSpeed,
    vy: Math.sin(angle) * state.player.bulletSpeed,
    size: state.player.bulletSize,
    damage: state.player.damage,
    pierceLeft: state.player.pierce,
    life: 100
  });
}

function burstParticles(x, y, color, count = 14) {
  for (let index = 0; index < count; index += 1) {
    const angle = (Math.PI * 2 * index) / count;
    const speed = 1 + Math.random() * 3.2;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 24 + Math.random() * 28,
      color
    });
  }
}

function triggerHit() {
  if (state.player.shield > 0) {
    state.player.shield -= 1;
    state.player.invulnFrames = 45;
    burstParticles(state.player.x, state.player.y, "#7df9c1", 18);
    logMessage("Shield charge consumed.");
    messageEl.textContent = "Shield absorbed the impact.";
    return;
  }

  state.lives -= 1;
  state.combo = 1;
  state.comboTimer = 0;
  state.player.invulnFrames = 60;
  burstParticles(state.player.x, state.player.y, "#ff4d8d", 18);

  if (state.lives <= 0) {
    state.running = false;
    state.best = Math.max(state.best, state.score);
    localStorage.setItem("pixel-raiders-best", String(state.best));
    messageEl.textContent = "Run over. Start a new breach to try again.";
    logMessage("Suit integrity collapsed. Link lost.");
  } else {
    messageEl.textContent = "Hull breach detected. Keep moving.";
  }
}

function rewardKill(enemy) {
  state.combo = Math.min(8, Number((state.combo + 0.25).toFixed(2)));
  state.comboTimer = 160;

  const points = Math.round(enemy.scoreValue * state.combo);
  const shards = enemy.shardValue + state.salvageBonus;

  state.score += points;
  state.shards += shards;

  if (state.score > state.best) {
    state.best = state.score;
  }

  if (enemy.boss) {
    logMessage(`Titan destroyed. +${points} score, +${shards} shards.`);
    messageEl.textContent = "Titan core shattered. Push the breach wider.";
  }

  refreshUpgradeButtons();
}

function advanceWave() {
  state.wave += 1;
  state.waveStartScore = state.score;
  state.nextWaveScore = state.score + 240 + state.wave * 145;
  state.bossSpawned = false;
  state.shards += 30;
  state.spawnCooldown = 24;

  const beatIndex = Math.min(storyBeats.length - 1, Math.floor(state.wave / 2));
  storyTextEl.textContent = storyBeats[beatIndex];
  messageEl.textContent = state.wave % 4 === 0 ? "Boss wave incoming. Spend shards now." : "Sector cracked. Enemy pressure is rising.";
  logMessage(`Sector ${String(state.wave).padStart(2, "0")} unlocked.`);
  renderUpgrades();
}

function updatePlayer() {
  const player = state.player;
  let vx = 0;
  let vy = 0;

  if (keys.has("w") || keys.has("arrowup")) vy -= 1;
  if (keys.has("s") || keys.has("arrowdown")) vy += 1;
  if (keys.has("a") || keys.has("arrowleft")) vx -= 1;
  if (keys.has("d") || keys.has("arrowright")) vx += 1;

  const length = Math.hypot(vx, vy) || 1;
  const speed = player.dashFrames > 0 ? player.speedBase * 2.35 : player.speedBase;
  player.x += (vx / length) * speed;
  player.y += (vy / length) * speed;
  player.x = Math.max(player.r, Math.min(W - player.r, player.x));
  player.y = Math.max(player.r, Math.min(H - player.r, player.y));

  if (player.dashFrames > 0) player.dashFrames -= 1;
  if (player.invulnFrames > 0) player.invulnFrames -= 1;
  if (state.dashCooldown > 0) state.dashCooldown -= 1;
}

function updateBullets() {
  state.bullets.forEach((bullet) => {
    bullet.x += bullet.vx;
    bullet.y += bullet.vy;
    bullet.life -= 1;
  });

  state.bullets = state.bullets.filter(
    (bullet) => bullet.life > 0 && bullet.x > -20 && bullet.x < W + 20 && bullet.y > -20 && bullet.y < H + 20
  );
}

function updateEnemies(frameCount) {
  state.enemies.forEach((enemy) => {
    const angle = Math.atan2(state.player.y - enemy.y, state.player.x - enemy.x);
    const sway = enemy.boss ? Math.sin(frameCount * 0.03 + enemy.wobble) * 0.08 : Math.sin(frameCount * 0.08 + enemy.wobble) * 0.18;
    enemy.x += Math.cos(angle + sway) * enemy.speed;
    enemy.y += Math.sin(angle + sway) * enemy.speed;

    if (state.player.invulnFrames <= 0 && Math.hypot(enemy.x - state.player.x, enemy.y - state.player.y) < enemy.r + state.player.r) {
      enemy.hp = 0;
      triggerHit();
    }
  });
}

function handleCombat() {
  state.bullets.forEach((bullet) => {
    state.enemies.forEach((enemy) => {
      if (enemy.hp <= 0) return;
      if (Math.hypot(enemy.x - bullet.x, enemy.y - bullet.y) < enemy.r + bullet.size) {
        enemy.hp -= bullet.damage;
        burstParticles(bullet.x, bullet.y, enemy.color, enemy.boss ? 10 : 7);
        if (bullet.pierceLeft > 0) {
          bullet.pierceLeft -= 1;
        } else {
          bullet.life = 0;
        }

        if (enemy.hp <= 0) {
          rewardKill(enemy);
        }
      }
    });
  });

  state.enemies = state.enemies.filter((enemy) => enemy.hp > 0);
}

function updateParticles() {
  state.particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.life -= 1;
  });
  state.particles = state.particles.filter((particle) => particle.life > 0);
}

let frameCount = 0;

function update() {
  if (!state.running || state.paused) return;

  frameCount += 1;
  updatePlayer();

  if (state.comboTimer > 0) {
    state.comboTimer -= 1;
  } else {
    state.combo = 1;
  }

  if (state.cooldown <= 0) {
    shootAtClosest();
    state.cooldown = state.player.fireInterval;
  } else {
    state.cooldown -= 1;
  }

  if (state.spawnCooldown <= 0) {
    spawnEnemy();
    const bossAlive = state.enemies.some((enemy) => enemy.boss);
    state.spawnCooldown = bossAlive ? 42 : Math.max(16, 46 - state.wave * 1.7);
  } else {
    state.spawnCooldown -= 1;
  }

  updateBullets();
  updateEnemies(frameCount);
  handleCombat();
  updateParticles();

  const bossAlive = state.enemies.some((enemy) => enemy.boss);
  if (!bossAlive && state.score >= state.nextWaveScore) {
    advanceWave();
  }

  refreshUpgradeButtons();
  syncHud();
}

function drawBackdrop() {
  const gradient = ctx.createLinearGradient(0, 0, 0, H);
  gradient.addColorStop(0, "#091024");
  gradient.addColorStop(1, "#05070f");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "rgba(52, 210, 255, 0.08)";
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y < H; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  for (let index = 0; index < 90; index += 1) {
    ctx.fillStyle = index % 2 ? "#0b1731" : "#0d1228";
    const x = (index * 127 + frameCount * 0.6) % W;
    const y = (index * 73 + frameCount * 0.4) % H;
    ctx.fillRect(x, y, 2, 2);
  }
}

function drawPlayer() {
  const player = state.player;
  ctx.save();
  ctx.translate(player.x, player.y);

  if (player.invulnFrames > 0 && Math.floor(player.invulnFrames / 5) % 2 === 0) {
    ctx.globalAlpha = 0.55;
  }

  ctx.beginPath();
  ctx.fillStyle = player.dashFrames > 0 ? "#a6f4ff" : "#34d2ff";
  ctx.arc(0, 0, player.r, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineWidth = 2;
  ctx.strokeStyle = player.shield > 0 ? "#7df9c1" : "#8ee9ff";
  ctx.beginPath();
  ctx.arc(0, 0, player.r + 7, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#f2fbff";
  ctx.fillRect(7, -2, 8, 4);
  ctx.restore();
}

function drawBullets() {
  state.bullets.forEach((bullet) => {
    ctx.fillStyle = "#f2fbff";
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawEnemies() {
  state.enemies.forEach((enemy) => {
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    ctx.beginPath();
    ctx.fillStyle = enemy.color;
    ctx.arc(0, 0, enemy.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = enemy.boss ? "#fff0b3" : "rgba(255,255,255,0.16)";
    ctx.arc(-enemy.r * 0.22, -enemy.r * 0.18, enemy.r * 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const hpRatio = Math.max(0, enemy.hp / enemy.maxHp);
    ctx.fillStyle = "#1f2a44";
    ctx.fillRect(enemy.x - enemy.r, enemy.y - enemy.r - 12, enemy.r * 2, 5);
    ctx.fillStyle = enemy.boss ? "#ffb84d" : "#7df9c1";
    ctx.fillRect(enemy.x - enemy.r, enemy.y - enemy.r - 12, enemy.r * 2 * hpRatio, 5);
  });
}

function drawParticles() {
  state.particles.forEach((particle) => {
    ctx.fillStyle = particle.color;
    ctx.fillRect(particle.x, particle.y, 2.5, 2.5);
  });
}

function drawOverlay() {
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  for (let y = 0; y < H; y += 6) {
    ctx.fillRect(0, y, W, 1);
  }
}

function draw() {
  drawBackdrop();
  drawPlayer();
  drawBullets();
  drawEnemies();
  drawParticles();
  drawOverlay();
}

function tick() {
  update();
  draw();
  requestAnimationFrame(tick);
}

window.addEventListener("keydown", (event) => {
  keys.add(event.key.toLowerCase());

  if (event.key === "Shift" && state.running && state.dashCooldown <= 0) {
    state.player.dashFrames = state.player.dashFramesMax;
    state.player.invulnFrames = Math.max(state.player.invulnFrames, 10);
    state.dashCooldown = state.dashMax;
    burstParticles(state.player.x, state.player.y, "#88f6ff", 12);
  }
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.key.toLowerCase());
});

startBtn.addEventListener("click", () => {
  resetRuntimeValues();
  renderUpgrades();
  syncHud();
});

pauseBtn.addEventListener("click", () => {
  if (!state.running) return;
  state.paused = !state.paused;
  pauseBtn.textContent = state.paused ? "Resume" : "Pause";
  messageEl.textContent = state.paused ? "Run paused. Spend shards and resume when ready." : "Run active. Keep the multiplier alive.";
});

renderUpgrades();
syncHud();
logMessage("Awaiting breach authorization.");
tick();
