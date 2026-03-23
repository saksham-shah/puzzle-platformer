import { createWorld, deleteWorld } from 'bitecs'

import { LEVELS }                                     from './levels'
import { loadLevel }                                  from './worldBuilder'
import { createRenderer, buildSprites, renderSystem } from './renderer'
import { initInputListeners, inputSystem }            from './systems/inputSystem'
import { movementSystem }                             from './systems/movementSystem'
import { physicsSyncSystem }                          from './systems/physicsSyncSystem'
import { triggerSystem }                              from './systems/triggerSystem'
import { PHYSICS_STEP }                               from './constants'

async function main() {
  // rapier2d-compat exposes .init() and works without manual WASM loading
  const RAPIER = await import('@dimforge/rapier2d-compat')
  await RAPIER.init()

  const container = document.getElementById('game-container')!
  const renderer  = createRenderer(container)

  initInputListeners()

  let currentLevelIndex = 0

  function loadCurrentLevel() {
    const levelDef = LEVELS[currentLevelIndex]!
    const world    = createWorld()
    const { rapierWorld, bodyMap, tileSizes } = loadLevel(world, RAPIER, levelDef)
    buildSprites(world, renderer, tileSizes)
    return { world, rapierWorld, bodyMap }
  }

  let { world, rapierWorld, bodyMap } = loadCurrentLevel()

  let accumulator   = 0
  let lastTimestamp = performance.now()
  let dead          = false
  let levelComplete = false
  let restartDelay  = 0

  renderer.app.ticker.add(() => {
    const now   = performance.now()
    const delta = Math.min((now - lastTimestamp) / 1000, 0.1)
    lastTimestamp = now

    if (dead || levelComplete) {
      restartDelay -= delta
      if (restartDelay <= 0) {
        if (levelComplete) currentLevelIndex = (currentLevelIndex + 1) % LEVELS.length
        deleteWorld(world)
        ;({ world, rapierWorld, bodyMap } = loadCurrentLevel())
        dead = false; levelComplete = false; restartDelay = 0
      }
      return
    }

    accumulator += delta
    while (accumulator >= PHYSICS_STEP) {
      inputSystem(world)
      movementSystem(world, rapierWorld, bodyMap)
      rapierWorld.step()
      physicsSyncSystem(world, rapierWorld, RAPIER, bodyMap)
      accumulator -= PHYSICS_STEP
    }

    const { events } = triggerSystem(world)
    for (const ev of events) {
      if (ev === 'death') { dead = true; restartDelay = 1.2 }
      if (ev === 'goal')  { levelComplete = true; restartDelay = 1.0 }
    }

    renderSystem(world, renderer)
  })
}

main().catch(console.error)