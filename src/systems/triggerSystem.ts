import { IWorld, query } from 'bitecs'
import type RAPIER from '@dimforge/rapier2d'
import { Position, Player, Goal, Hazard } from '../components'
import { PLAYER_HALF_W, PLAYER_HALF_H } from '../constants'

export type GameEvent = 'goal' | 'death'

/**
 * Simple AABB overlap check between the player and trigger tiles.
 * Rapier sensors would be more robust for complex levels, but AABB is
 * perfectly fine for a puzzle platformer and easy to reason about.
 */
export function triggerSystem(
  world : IWorld,
): { world: IWorld; events: GameEvent[] } {
  const events: GameEvent[] = []

  const players = query(world, [Player, Position])
  if (players.length === 0) return { world, events }

  const eid = players[0]!
  const px = Position.x[eid] ?? 0
  const py = Position.y[eid] ?? 0

  // ── Goals ─────────────────────────────────────────────────────────────────
  for (const gid of query(world, [Goal, Position])) {
    if (aabbOverlap(
      px, py, PLAYER_HALF_W, PLAYER_HALF_H,
      Position.x[gid] ?? 0, Position.y[gid] ?? 0,
      // Goal is stored in Position but we need its half-extents.
      // For simplicity store them in the Position component as w/h via a
      // separate approach — or hard-code 0.5 here for now.
      0.5, 0.6,
    )) {
      events.push('goal')
    }
  }

  // ── Hazards ───────────────────────────────────────────────────────────────
  for (const hid of query(world, [Hazard, Position])) {
    if (aabbOverlap(
      px, py, PLAYER_HALF_W, PLAYER_HALF_H,
      Position.x[hid] ?? 0, Position.y[hid] ?? 0,
      0.3, 0.3,
    )) {
      events.push('death')
    }
  }

  return { world, events }
}

function aabbOverlap(
  ax: number, ay: number, ahw: number, ahh: number,
  bx: number, by: number, bhw: number, bhh: number,
): boolean {
  return (
    Math.abs(ax - bx) < ahw + bhw &&
    Math.abs(ay - by) < ahh + bhh
  )
}
