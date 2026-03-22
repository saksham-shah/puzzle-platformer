import { IWorld, query, addComponent, removeComponent } from 'bitecs'
import type RAPIER from '@dimforge/rapier2d'
import { Position, Velocity, RigidBodyRef, Grounded, Player } from '../components'
import { PLAYER_HALF_H } from '../constants'

/**
 * After each Rapier step, copy body positions into ECS components so
 * render systems have a single authoritative source of truth.
 *
 * Also does a simple ground check by casting a tiny ray downward from
 * the player's feet.
 */
export function physicsSyncSystem(
  world       : IWorld,
  rapierWorld : RAPIER.World,
  RAPIER      : typeof import('@dimforge/rapier2d'),
  bodyMap     : Map<number, RAPIER.RigidBody>,
): IWorld {
  const entities = query(world, [Position, RigidBodyRef])

  for (const eid of entities) {
    const body = bodyMap.get(eid)
    if (!body) continue

    const pos = body.translation()
    const vel = body.linvel()

    Position.x[eid] = pos.x
    Position.y[eid] = pos.y
    Velocity.x[eid] = vel.x
    Velocity.y[eid] = vel.y
  }

  // ── Ground detection for player entities ──────────────────────────────────
  const players = query(world, [Player, Position, RigidBodyRef])

  for (const eid of players) {
    const body = bodyMap.get(eid)
    if (!body) continue

    const pos = body.translation()

    // Cast a short ray straight down from the player's foot position
    const origin    = new RAPIER.Ray({ x: pos.x, y: pos.y - PLAYER_HALF_H }, { x: 0, y: -1 })
    const maxToi    = 0.15   // metres — small skin distance
    const hit       = rapierWorld.castRay(origin, maxToi, true)

    if (hit !== null) {
      addComponent(world, Grounded, eid)
    } else {
      removeComponent(world, Grounded, eid)
    }
  }

  return world
}
