import { type World, query, hasComponent } from 'bitecs'
import type RAPIER from '@dimforge/rapier2d-compat'
import { Input, Player, RigidBodyRef, Grounded } from '../components'
import { PLAYER_SPEED, PLAYER_JUMP_FORCE } from '../constants'

const JUMP_BUFFER_FRAMES = 6
let jumpBuffer = 0

export function movementSystem(
  world   : World,
  bodyMap : Map<number, RAPIER.RigidBody>,
): void {
  for (const eid of query(world, [Player, Input, RigidBodyRef])) {
    const body = bodyMap.get(eid)
    if (!body) continue

    const vel   = body.linvel()
    const dir   = (Input.right[eid] ?? 0) - (Input.left[eid] ?? 0)
    const newVx = lerp(vel.x, dir * PLAYER_SPEED, 0.25)

    if (Input.jump[eid]) jumpBuffer = JUMP_BUFFER_FRAMES
    if (jumpBuffer > 0) jumpBuffer--

    let newVy = vel.y
    if (jumpBuffer > 0 && hasComponent(world, eid, Grounded)) {
      newVy      = PLAYER_JUMP_FORCE
      jumpBuffer = 0
    }

    body.setLinvel({ x: newVx, y: newVy }, true)
  }
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}