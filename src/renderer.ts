import * as PIXI from 'pixi.js'
import { IWorld, query } from 'bitecs'
import { Position, Player, Platform, Goal, Hazard } from '../components'
import {
  CANVAS_W, CANVAS_H, PIXELS_PER_METER,
  COLOR,
} from '../constants'

// ─── Sprite pools ─────────────────────────────────────────────────────────────
// We re-create graphics on level load; during gameplay we just update positions.

export interface RendererState {
  app          : PIXI.Application
  worldContainer: PIXI.Container
  spriteMap    : Map<number, PIXI.Graphics>
}

/** Boot PixiJS and attach canvas to the DOM. */
export function createRenderer(container: HTMLElement): RendererState {
  const app = new PIXI.Application({
    width           : CANVAS_W,
    height          : CANVAS_H,
    backgroundColor : COLOR.background,
    antialias       : false,
    resolution      : window.devicePixelRatio || 1,
    autoDensity     : true,
  })

  container.appendChild(app.view as HTMLCanvasElement)

  const worldContainer = new PIXI.Container()
  app.stage.addChild(worldContainer)

  return { app, worldContainer, spriteMap: new Map() }
}

/** Call once after a level is loaded to create graphics for each entity. */
export function buildSprites(world: IWorld, state: RendererState, tileSizes: Map<number, { w: number; h: number }>): void {
  // Clear old sprites
  state.worldContainer.removeChildren()
  state.spriteMap.clear()

  const addSprite = (eid: number, color: number, w: number, h: number) => {
    const g = new PIXI.Graphics()
    g.beginFill(color, 1)
    g.drawRect(-w * PIXELS_PER_METER, -h * PIXELS_PER_METER, w * 2 * PIXELS_PER_METER, h * 2 * PIXELS_PER_METER)
    g.endFill()
    state.worldContainer.addChild(g)
    state.spriteMap.set(eid, g)
  }

  for (const eid of query(world, [Platform, Position])) {
    const sz = tileSizes.get(eid) ?? { w: 1, h: 0.4 }
    addSprite(eid, COLOR.platform, sz.w, sz.h)
  }
  for (const eid of query(world, [Goal, Position])) {
    const sz = tileSizes.get(eid) ?? { w: 0.5, h: 0.6 }
    addSprite(eid, COLOR.goal, sz.w, sz.h)
  }
  for (const eid of query(world, [Hazard, Position])) {
    const sz = tileSizes.get(eid) ?? { w: 0.3, h: 0.3 }
    addSprite(eid, COLOR.hazard, sz.w, sz.h)
  }
  for (const eid of query(world, [Player, Position])) {
    addSprite(eid, COLOR.player, 0.4, 0.6)
  }
}

/** Called every frame — updates sprite screen positions from ECS Position data. */
export function renderSystem(world: IWorld, state: RendererState): void {
  const { worldContainer, spriteMap } = state

  // Camera: follow the player
  const players = query(world, [Player, Position])
  let camX = CANVAS_W / 2
  let camY = CANVAS_H / 2

  if (players.length > 0) {
    const eid = players[0]!
    camX = (Position.x[eid] ?? 0) * PIXELS_PER_METER
    camY = (Position.y[eid] ?? 0) * PIXELS_PER_METER
  }

  worldContainer.x = CANVAS_W  / 2 - camX
  worldContainer.y = CANVAS_H * 0.55 + camY   // Y-up → screen Y-down flip

  // Update all sprites
  const entities = query(world, [Position])
  for (const eid of entities) {
    const sprite = spriteMap.get(eid)
    if (!sprite) continue
    sprite.x = (Position.x[eid] ?? 0) * PIXELS_PER_METER
    sprite.y = -(Position.y[eid] ?? 0) * PIXELS_PER_METER  // flip Y
  }
}
