import { IWorld, query, hasComponent } from 'bitecs'
import type RAPIER from '@dimforge/rapier2d'
import { Input, Player, RigidBodyRef, Grounded } from '../components'
import { PLAYER_SPEED, PLAYER_JUMP_FORCE } from '../constants'

// Jump buffering: allow jump input to be "remembered" for a few frames
const JUMP_BUFFER_FRAMES = 6
let jumpBuffer = 0

export function movementSystem(
  world       : IWorld,
  rapierWorld : RAPIER.World,
  bodyMap     : Map<number, RAPIER.RigidBody>,
): IWorld {
  const entities = query(world, [Player, Input, RigidBodyRef])

  for (const eid of entities) {
    const body = bodyMap.get(eid)
    if (!body) continue

    const vel = body.linvel()

    // ── Horizontal movement ────────────────────────────────────────────────
    const dir = (Input.right[eid] ?? 0) - (Input.left[eid] ?? 0)
    const targetVx = dir * PLAYER_SPEED
    // Lerp towards target velocity for snappy-but-not-instant feel
    const newVx = lerp(vel.x, targetVx, 0.25)

    // ── Jump ───────────────────────────────────────────────────────────────
    if (Input.jump[eid]) jumpBuffer = JUMP_BUFFER_FRAMES
    if (jumpBuffer > 0) jumpBuffer--

    const grounded = hasComponent(world, Grounded, eid)
    let newVy = vel.y

    if (jumpBuffer > 0 && grounded) {
      newVy      = PLAYER_JUMP_FORCE
      jumpBuffer = 0
    }

    body.setLinvel({ x: newVx, y: newVy }, true)
  }

  return world
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}
