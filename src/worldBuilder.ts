import { type World, addEntity, addComponent } from 'bitecs'
import type RAPIER from '@dimforge/rapier2d-compat'
import type { LevelDef } from './levels'
import {
  Position, Velocity, RigidBodyRef,
  Player, Platform, Goal, Hazard, Input,
} from './components'

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type RapierModule = typeof import('@dimforge/rapier2d-compat')

export interface WorldObjects {
  playerEid : number
  bodyMap   : Map<number, RAPIER.RigidBody>
  tileSizes : Map<number, { w: number; h: number }>
}

export function loadLevel(
  world    : World,
  Rapier   : RapierModule,
  levelDef : LevelDef,
): { rapierWorld: RAPIER.World } & WorldObjects {

  const rapierWorld = new Rapier.World({ x: 0, y: -30 })
  const bodyMap     = new Map<number, RAPIER.RigidBody>()
  const tileSizes   = new Map<number, { w: number; h: number }>()

  for (const tile of levelDef.tiles) {
    const eid = addEntity(world)
    addComponent(world, eid, Position)
    Position.x[eid] = tile.x
    Position.y[eid] = tile.y
    tileSizes.set(eid, { w: tile.w, h: tile.h })

    if (tile.kind === 'platform') addComponent(world, eid, Platform)
    if (tile.kind === 'goal')     addComponent(world, eid, Goal)
    if (tile.kind === 'hazard')   addComponent(world, eid, Hazard)

    if (tile.kind === 'platform') {
      const bodyDesc = Rapier.RigidBodyDesc.fixed().setTranslation(tile.x, tile.y)
      const body     = rapierWorld.createRigidBody(bodyDesc)
      rapierWorld.createCollider(Rapier.ColliderDesc.cuboid(tile.w, tile.h), body)
      addComponent(world, eid, RigidBodyRef)
      RigidBodyRef.handle[eid] = body.handle
      bodyMap.set(eid, body)
    }
  }

  const playerEid = addEntity(world)
  addComponent(world, playerEid, Position)
  addComponent(world, playerEid, Velocity)
  addComponent(world, playerEid, RigidBodyRef)
  addComponent(world, playerEid, Player)
  addComponent(world, playerEid, Input)

  Position.x[playerEid] = levelDef.playerStart.x
  Position.y[playerEid] = levelDef.playerStart.y

  const playerBodyDesc = Rapier.RigidBodyDesc
    .dynamic()
    .setTranslation(levelDef.playerStart.x, levelDef.playerStart.y)
    .lockRotations()
    .setLinearDamping(0.05)

  const playerBody = rapierWorld.createRigidBody(playerBodyDesc)
  rapierWorld.createCollider(
    Rapier.ColliderDesc.cuboid(0.4, 0.6).setFriction(0.3),
    playerBody,
  )
  RigidBodyRef.handle[playerEid] = playerBody.handle
  bodyMap.set(playerEid, playerBody)

  return { rapierWorld, playerEid, bodyMap, tileSizes }
}