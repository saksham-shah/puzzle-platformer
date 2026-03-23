import { type IWorld, query, addComponent, removeComponent } from 'bitecs'
import type RAPIER from '@dimforge/rapier2d-compat'
import { Position, Velocity, RigidBodyRef, Grounded, Player } from '../components'
import { PLAYER_HALF_H } from '../constants'

type RapierModule = typeof import('@dimforge/rapier2d-compat')

export function physicsSyncSystem(
  world       : IWorld,
  rapierWorld : RAPIER.World,
  RAPIER      : RapierModule,
  bodyMap     : Map<number, RAPIER.RigidBody>,
): IWorld {
  for (const eid of query(world, [Position, RigidBodyRef])) {
    const body = bodyMap.get(eid)
    if (!body) continue

    const pos = body.translation()
    const vel = body.linvel()
    Position.x[eid] = pos.x
    Position.y[eid] = pos.y
    Velocity.x[eid] = vel.x
    Velocity.y[eid] = vel.y
  }

  for (const eid of query(world, [Player, Position, RigidBodyRef])) {
    const body = bodyMap.get(eid)
    if (!body) continue

    const pos    = body.translation()
    const origin = new RAPIER.Ray({ x: pos.x, y: pos.y - PLAYER_HALF_H }, { x: 0, y: -1 })
    const hit    = rapierWorld.castRay(origin, 0.15, true)

    if (hit !== null) {
      addComponent(world, Grounded, eid)
    } else {
      removeComponent(world, Grounded, eid)
    }
  }

  return world
}