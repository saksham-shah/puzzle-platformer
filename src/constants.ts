// ─── World / Physics ────────────────────────────────────────────────────────
export const GRAVITY = { x: 0, y: -30 }   // Rapier uses Y-up; we flip in render

export const PHYSICS_STEP = 1 / 60         // seconds per physics tick

// ─── Player ─────────────────────────────────────────────────────────────────
export const PLAYER_SPEED       = 8        // m/s horizontal
export const PLAYER_JUMP_FORCE  = 14       // m/s vertical impulse
export const PLAYER_HALF_W      = 0.4      // metres
export const PLAYER_HALF_H      = 0.6

// ─── Rendering ──────────────────────────────────────────────────────────────
export const PIXELS_PER_METER   = 48       // scale factor world→screen
export const CANVAS_W           = 960
export const CANVAS_H           = 540

// ─── Colours ────────────────────────────────────────────────────────────────
export const COLOR = {
  background : 0x0d0f1a,
  platform   : 0x2a6dd9,
  platformAlt: 0x1a4a9a,
  player     : 0xe8f4ff,
  goal       : 0xf5c542,
  hazard     : 0xe05050,
  text       : 0xc8e6ff,
} as const
