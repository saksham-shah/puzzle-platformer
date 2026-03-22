// ─── Types ───────────────────────────────────────────────────────────────────

export type TileKind = 'platform' | 'goal' | 'hazard'

export interface Tile {
  kind   : TileKind
  x      : number   // centre in metres
  y      : number   // centre in metres (Y-up)
  w      : number   // half-width in metres
  h      : number   // half-height in metres
}

export interface LevelDef {
  name        : string
  playerStart : { x: number; y: number }
  tiles       : Tile[]
}

// ─── Levels ──────────────────────────────────────────────────────────────────

export const LEVELS: LevelDef[] = [
  // ── Level 1 ──────────────────────────────────────────────────────────────
  {
    name        : 'Take Off',
    playerStart : { x: 2, y: 2 },
    tiles       : [
      // Ground
      { kind: 'platform', x: 10,  y: -0.5, w: 12,  h: 0.5  },

      // Stepping stones
      { kind: 'platform', x: 4,   y: 2,    w: 1.5, h: 0.4  },
      { kind: 'platform', x: 7.5, y: 3.5,  w: 1.2, h: 0.4  },
      { kind: 'platform', x: 11,  y: 5,    w: 1.5, h: 0.4  },
      { kind: 'platform', x: 14,  y: 3,    w: 1,   h: 0.4  },

      // Moving hazard row
      { kind: 'hazard',   x: 6,   y: 1.2,  w: 0.3, h: 0.3  },
      { kind: 'hazard',   x: 9,   y: 1.2,  w: 0.3, h: 0.3  },

      // Goal
      { kind: 'goal',     x: 17,  y: 0.6,  w: 0.5, h: 0.6  },
    ],
  },

  // ── Level 2 ──────────────────────────────────────────────────────────────
  {
    name        : 'The Gap',
    playerStart : { x: 1, y: 2 },
    tiles       : [
      // Left island
      { kind: 'platform', x: 2,  y: -0.5, w: 3,   h: 0.5 },
      // Right island
      { kind: 'platform', x: 16, y: -0.5, w: 5,   h: 0.5 },
      // Narrow bridge pieces
      { kind: 'platform', x: 7,  y: 1.5,  w: 0.6, h: 0.4 },
      { kind: 'platform', x: 10, y: 3,    w: 0.6, h: 0.4 },
      { kind: 'platform', x: 13, y: 1.5,  w: 0.6, h: 0.4 },
      // Hazards below the gaps
      { kind: 'hazard',   x: 7,  y: -2,   w: 6,   h: 0.5 },
      // Goal
      { kind: 'goal',     x: 19, y: 0.6,  w: 0.5, h: 0.6 },
    ],
  },
]
