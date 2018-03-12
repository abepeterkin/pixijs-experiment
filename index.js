let app = new PIXI.Application({
  width: 800,
  height: 600,
  antialias: false
})

const PLAYER_PARTICLES = 100;
const PARTICLE_JUMP_TIMER = 20;

let playerParticles = []

let player = new PIXI.Container()

app.stage.addChild(player)

document.getElementById('game-container').appendChild(app.view)

playerParticleContainer = new PIXI.particles.ParticleContainer()

function makePlayerParticleTexture() {
  let playerParticleGraphic = new PIXI.Graphics()
  playerParticleGraphic.beginFill(0xFFFFFF, 1)
  playerParticleGraphic.drawRect(0, 0, 5, 5)
  return app.renderer.generateTexture(playerParticleGraphic)
}

function jumpParticle(sprite, anchorX, anchorY) {
  let angle = Math.random() * (Math.PI * 2)
  let magnitude = Math.random() * 50
  sprite.x = (Math.cos(angle) * magnitude) + anchorX
  sprite.y = (Math.sin(angle) * magnitude) + anchorY
}

function createPlayerParticles() {
  let texture = makePlayerParticleTexture()
  for (let i = 0; i < PLAYER_PARTICLES; i++) {
    let sprite = new PIXI.Sprite(texture)
    sprite.anchor.set(0.5)
    jumpParticle(sprite, 200, 200)
    sprite.jumpTimer = Math.random() * PARTICLE_JUMP_TIMER
    playerParticles.push(sprite)
    player.addChild(sprite)
  }
}

setUp()

function setUp() {
  app.ticker.add(delta => gameLoop(delta))
  createPlayerParticles()
}

function gameLoop(delta) {
  for (sprite of playerParticles) {
    sprite.jumpTimer--
    if (sprite.jumpTimer < 0) {
      jumpParticle(sprite, 200, 200)
      sprite.jumpTimer = PARTICLE_JUMP_TIMER
      sprite.alpha = 1
    } else {
      sprite.alpha = sprite.jumpTimer / PARTICLE_JUMP_TIMER
    }
  }
}
