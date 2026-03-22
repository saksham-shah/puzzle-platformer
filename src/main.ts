import { createWorld, deleteWorld } from 'bitecs'
import RAPIER from '@dimforge/rapier2d'

import { LEVELS }                from './levels'
import { loadLevel }             from './worldBuilder'
import { createRenderer, buildSprites, renderSystem } from './renderer'
import { initInputListeners, inputSystem }           from './systems/inputSystem'
import { movementSystem }        from './systems/movementSystem'
import { physicsSyncSystem }     from './systems/physicsSyncSystem'
import { triggerSystem }         from './systems/triggerSystem'
import { PHYSICS_STEP }          from './constants'

// ─── Bootstrap ───────────────────────────────────────────────────────────────

async function main() {
  // Rapier loads WASM asynchronously
  await RAPIER.init()

  const container = document.getElementById('game-container')!
  const renderer  = createRenderer(container)

  initInputListeners()

  let currentLevelIndex = 0

  // ── Level loader ──────────────────────────────────────────────────────────
  function loadCurrentLevel() {
    const levelDef = LEVELS[currentLevelIndex]!

    // Fresh ECS world per level (simplest approach; no need to manually
    // clean up components/entities from the previous level).
    const world = createWorld()

    const { rapierWorld, bodyMap, tileSizes } = loadLevel(world, RAPIER, levelDef)

    buildSprites(world, renderer, tileSizes)

    return { world, rapierWorld, bodyMap }
  }

  let { world, rapierWorld, bodyMap } = loadCurrentLevel()

  // ── Fixed-timestep accumulator ────────────────────────────────────────────
  let accumulator   = 0
  let lastTimestamp = performance.now()
  let dead          = false
  let levelComplete = false
  let restartDelay  = 0

  // ── Game loop ─────────────────────────────────────────────────────────────
  renderer.app.ticker.add(() => {
    const now   = performance.now()
    const delta = Math.min((now - lastTimestamp) / 1000, 0.1)  // seconds; capped
    lastTimestamp = now

    // ── Restart / next-level countdown ──────────────────────────────────────
    if (dead || levelComplete) {
      restartDelay -= delta
      if (restartDelay <= 0) {
        if (levelComplete) {
          currentLevelIndex = (currentLevelIndex + 1) % LEVELS.length
        }
        // Rebuild
        deleteWorld(world)
        ;({ world, rapierWorld, bodyMap } = loadCurrentLevel())
        dead          = false
        levelComplete = false
        restartDelay  = 0
      }
      return
    }

    // ── Fixed physics steps ──────────────────────────────────────────────────
    accumulator += delta

    while (accumulator >= PHYSICS_STEP) {
      // 1. Read input → write to ECS
      inputSystem(world)

      // 2. Apply movement forces to Rapier bodies
      movementSystem(world, rapierWorld, bodyMap)

      // 3. Step the physics simulation
      rapierWorld.step()

      // 4. Copy Rapier transforms back into ECS
      physicsSyncSystem(world, rapierWorld, RAPIER, bodyMap)

      accumulator -= PHYSICS_STEP
    }

    // ── Trigger checks (once per visual frame is sufficient) ─────────────────
    const { events } = triggerSystem(world)
    for (const ev of events) {
      if (ev === 'death') {
        dead         = true
        restartDelay = 1.2
      }
      if (ev === 'goal') {
        levelComplete = true
        restartDelay  = 1.0
      }
    }

    // ── Render ───────────────────────────────────────────────────────────────
    renderSystem(world, renderer)
  })
}

main().catch(console.error)
