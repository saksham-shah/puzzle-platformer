import { IWorld, query } from 'bitecs'
import { Input, Player } from '../components'

// Raw key state — updated by global event listeners
const keys: Record<string, boolean> = {}

export function initInputListeners(): void {
  window.addEventListener('keydown', (e) => { keys[e.code] = true  })
  window.addEventListener('keyup',   (e) => { keys[e.code] = false })
}

export function inputSystem(world: IWorld): IWorld {
  const entities = query(world, [Player, Input])

  for (const eid of entities) {
    Input.left[eid]  = (keys['ArrowLeft']  || keys['KeyA']) ? 1 : 0
    Input.right[eid] = (keys['ArrowRight'] || keys['KeyD']) ? 1 : 0
    Input.jump[eid]  = (keys['Space'] || keys['ArrowUp'] || keys['KeyW']) ? 1 : 0
  }

  return world
}
