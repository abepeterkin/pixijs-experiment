window.addEventListener("resize", function() {
  app.renderer.resize(window.innerWidth, window.innerHeight)
})

let app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  antialias: false,
  clearBeforeRender: true
})

const PLAYER_PARTICLES = 100
const PLAYER_PARTICLE_RADIUS = 50
const PARTICLE_JUMP_TIMER = 20
const PLAYER_ACC = 1
const PLAYER_MAX_VELOCITY = 15
const PLAYER_FRICTION = 0.5

let playerParticles = []

let player = new PIXI.Container()
player.x = 200
player.y = 200
player.velocity = 0
player.angle = 0

const CURSOR_MAX_RADIUS = 50;
let cursorRadius = CURSOR_MAX_RADIUS;

let appInteractionManager = app.renderer.plugins.interaction

app.stage.addChild(player)

document.getElementById('game-container').appendChild(app.view)

playerParticleContainer = new PIXI.particles.ParticleContainer()

let playerCircle = new PIXI.Graphics()
app.stage.addChild(playerCircle)

let cursorGraphic = new PIXI.Graphics()
app.stage.addChild(cursorGraphic)

setUp()

function makePlayerParticleTexture() {
  const playerParticleGraphic = new PIXI.Graphics()
  playerParticleGraphic.beginFill(0xFFFFFF, 1)
  playerParticleGraphic.drawRect(0, 0, 5, 5)
  return app.renderer.generateTexture(playerParticleGraphic)
}

function jumpParticle(sprite, anchorX, anchorY) {
  const angle = Math.random() * (Math.PI * 2)
  const magnitude = Math.random() * PLAYER_PARTICLE_RADIUS
  sprite.x = (Math.cos(angle) * magnitude) + anchorX
  sprite.y = (Math.sin(angle) * magnitude) + anchorY
}

function createPlayerParticles() {
  const texture = makePlayerParticleTexture()
  for (let i = 0; i < PLAYER_PARTICLES; i++) {
    const sprite = new PIXI.Sprite(texture)
    sprite.anchor.set(0.5)
    jumpParticle(sprite, player.x, player.y)
    sprite.jumpTimer = Math.random() * PARTICLE_JUMP_TIMER
    playerParticles.push(sprite)
    app.stage.addChild(sprite)
  }
}

function setUp() {
  app.ticker.add(delta => gameLoop(delta))
  createPlayerParticles()
}

function updatePlayerParticles(delta) {
  for (sprite of playerParticles) {
    sprite.jumpTimer--
    if (sprite.jumpTimer < 0) {
      jumpParticle(sprite, player.x, player.y)
      sprite.jumpTimer = PARTICLE_JUMP_TIMER
      sprite.alpha = 1
    } else {
      sprite.alpha = sprite.jumpTimer / PARTICLE_JUMP_TIMER
    }
  }
}

function movePlayer(delta) {
  const mouse = appInteractionManager.mouse
  if (mouse.buttons === 1) {
    // accelerate player toward the mouse pointer
    if (player.velocity < PLAYER_MAX_VELOCITY) {
      player.velocity += PLAYER_ACC
    }
    player.angle = Math.atan2(mouse.global.y - player.y, mouse.global.x - player.x)
    // stop when over the pointer
    let magnitude = Math.hypot(mouse.global.y - player.y, mouse.global.x - player.x)
    if (magnitude < 5) player.velocity = 0
  }
  // add velocity to position
  const oldX = player.x
  const oldY = player.y
  player.x += Math.cos(player.angle) * player.velocity
  player.y += Math.sin(player.angle) * player.velocity
  // keep player in bounding box
  if (player.x < 0 || player.x > app.screen.width) {
    player.x = oldX;
  }
  if (player.y < 0 || player.y > app.screen.height) {
    player.y = oldY;
  }
  // friction
  player.velocity -= PLAYER_FRICTION * delta
  // prevent drift
  if (player.velocity < PLAYER_ACC / 4) player.velocity = 0
}


function drawPlayer() {
  playerCircle.clear()
  playerCircle.lineStyle(2, 0xFF00FF, 1)
  playerCircle.drawCircle(player.x, player.y, 50)
}

function drawCursor(delta) {
  const mouse = appInteractionManager.mouse
  const x = mouse.global.x
  const y = mouse.global.y
  cursorGraphic.clear()
  if(mouse.buttons === 1) {
    cursorGraphic.lineStyle(2, 0xFFFFFF, 1.2 - cursorRadius / CURSOR_MAX_RADIUS)
    cursorGraphic.drawRect(x - cursorRadius / 2, y - cursorRadius / 2, cursorRadius, cursorRadius)
    if (cursorRadius > 0) {
      cursorRadius -= 2
    } else {
      cursorRadius = CURSOR_MAX_RADIUS
    }
  } else {
    cursorRadius = CURSOR_MAX_RADIUS
  }
}


function gameLoop(delta) {
  console.log(delta)
  updatePlayerParticles(delta)
  movePlayer(delta)
  //drawPlayer()
  drawCursor(delta)
}
