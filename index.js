window.addEventListener("resize", function() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});

let app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  antialias: false
})

const PLAYER_PARTICLES = 100;
const PLAYER_PARTICLE_RADIUS = 50;
const PARTICLE_JUMP_TIMER = 20;
const PLAYER_MOVE_SPEED = 10;

let playerParticles = []

let player = new PIXI.Container()
player.x = 200;
player.y = 200;

let appInteractionManager = app.renderer.plugins.interaction

app.stage.addChild(player)

document.getElementById('game-container').appendChild(app.view)

playerParticleContainer = new PIXI.particles.ParticleContainer()

setUp()

function makePlayerParticleTexture() {
  let playerParticleGraphic = new PIXI.Graphics()
  playerParticleGraphic.beginFill(0xFFFFFF, 1)
  playerParticleGraphic.drawRect(0, 0, 5, 5)
  return app.renderer.generateTexture(playerParticleGraphic)
}

function jumpParticle(sprite, anchorX, anchorY) {
  let angle = Math.random() * (Math.PI * 2)
  let magnitude = Math.random() * PLAYER_PARTICLE_RADIUS
  sprite.x = (Math.cos(angle) * magnitude) + anchorX
  sprite.y = (Math.sin(angle) * magnitude) + anchorY
}

function createPlayerParticles() {
  let texture = makePlayerParticleTexture()
  for (let i = 0; i < PLAYER_PARTICLES; i++) {
    let sprite = new PIXI.Sprite(texture)
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

function updatePlayerParticles() {
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

function movePlayerTowardMouse() {
  let mouse = appInteractionManager.mouse
  if (mouse.buttons === 1) {
    let angle = Math.atan2(mouse.global.y - player.y, mouse.global.x - player.x)
    //let magnitude = mouse.global.y - player.y + mouse.global.x - player.x
    player.x += Math.cos(angle) * PLAYER_MOVE_SPEED
    player.y += Math.sin(angle) * PLAYER_MOVE_SPEED
  }
}

let playerCircle = new PIXI.Graphics()
app.stage.addChild(playerCircle)
function drawPlayer() {
  playerCircle.lineStyle(2, 0xFF00FF, 1);
  playerCircle.drawCircle(player.x, player.y, 50);
}

function gameLoop(delta) {
  updatePlayerParticles()
  movePlayerTowardMouse()

  //drawPlayer()
}
