// bitecs v0.4: components are plain objects/arrays — no defineComponent or Types needed.
// Any JS reference can be a component; identity is determined by reference.

export const Position     = { x: [] as number[], y: [] as number[] }
export const Velocity     = { x: [] as number[], y: [] as number[] }
export const RigidBodyRef = { handle: [] as number[] }

// Tag components — presence on an entity is enough, no data needed
export const Player   = [] as number[]
export const Platform = [] as number[]
export const Goal     = [] as number[]
export const Hazard   = [] as number[]
export const Grounded = [] as number[]

export const Input = {
  left  : [] as number[],
  right : [] as number[],
  jump  : [] as number[],
}