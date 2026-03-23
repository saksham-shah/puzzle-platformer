import { type IWorld, addEntity, addComponent } from 'bitecs'
import type RAPIER from '@dimforge/rapier2d-compat'
import type { LevelDef } from './levels'
import {
  Position, Velocity, RigidBodyRef,
  Player, Platform, Goal, Hazard, Input,
} from './components'

export interface WorldObjects {
  playerEid : number
  bodyMap   : Map<number, RAPIER.RigidBody>
  tileSizes : Map<number, { w: number; h: number }>
}

export function loadLevel(
  world    : IWorld,
  RAPIER   : typeof import('@dimforge/rapier2d-compat'),
  levelDef : LevelDef,
): { rapierWorld: RAPIER.World } & WorldObjects {

  const rapierWorld = new RAPIER.World({ x: 0, y: -30 })
  const bodyMap     = new Map<number, RAPIER.RigidBody>()
  const tileSizes   = new Map<number, { w: number; h: number }>()

  for (const tile of levelDef.tiles) {
    const eid = addEntity(world)

    addComponent(world, Position, eid)
    Position.x[eid] = tile.x
    Position.y[eid] = tile.y

    tileSizes.set(eid, { w: tile.w, h: tile.h })

    if (tile.kind === 'platform') addComponent(world, Platform, eid)
    if (tile.kind === 'goal')     addComponent(world, Goal,     eid)
    if (tile.kind === 'hazard')   addComponent(world, Hazard,   eid)

    if (tile.kind === 'platform') {
      const bodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(tile.x, tile.y)
      const body     = rapierWorld.createRigidBody(bodyDesc)
      rapierWorld.createCollider(RAPIER.ColliderDesc.cuboid(tile.w, tile.h), body)

      addComponent(world, RigidBodyRef, eid)
      RigidBodyRef.handle[eid] = body.handle
      bodyMap.set(eid, body)
    }
  }

  const playerEid = addEntity(world)
  addComponent(world, Position,     playerEid)
  addComponent(world, Velocity,     playerEid)
  addComponent(world, RigidBodyRef, playerEid)
  addComponent(world, Player,       playerEid)
  addComponent(world, Input,        playerEid)

  Position.x[playerEid] = levelDef.playerStart.x
  Position.y[playerEid] = levelDef.playerStart.y

  const playerBodyDesc = RAPIER.RigidBodyDesc
    .dynamic()
    .setTranslation(levelDef.playerStart.x, levelDef.playerStart.y)
    .lockRotations()
    .setLinearDamping(0.05)

  const playerBody = rapierWorld.createRigidBody(playerBodyDesc)
  rapierWorld.createCollider(
    RAPIER.ColliderDesc.cuboid(0.4, 0.6).setFriction(0.3),
    playerBody,
  )

  RigidBodyRef.handle[playerEid] = playerBody.handle
  bodyMap.set(playerEid, playerBody)

  return { rapierWorld, playerEid, bodyMap, tileSizes }
}