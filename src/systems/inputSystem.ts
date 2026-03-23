import { type World, query } from 'bitecs'
import { Input, Player } from '../components'

const keys: Record<string, boolean> = {}

export function initInputListeners(): void {
  window.addEventListener('keydown', (e) => { keys[e.code] = true  })
  window.addEventListener('keyup',   (e) => { keys[e.code] = false })
}

export function inputSystem(world: World): void {
  for (const eid of query(world, [Player, Input])) {
    Input.left[eid]  = (keys['ArrowLeft']  || keys['KeyA']) ? 1 : 0
    Input.right[eid] = (keys['ArrowRight'] || keys['KeyD']) ? 1 : 0
    Input.jump[eid]  = (keys['Space'] || keys['ArrowUp'] || keys['KeyW']) ? 1 : 0
  }
}