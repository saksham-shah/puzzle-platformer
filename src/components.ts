import { defineComponent, Types } from 'bitecs'

// ─── Position & Velocity (mirrors Rapier body, kept for rendering) ───────────
export const Position = defineComponent({ x: Types.f32, y: Types.f32 })
export const Velocity = defineComponent({ x: Types.f32, y: Types.f32 })

// ─── Physics body handle ─────────────────────────────────────────────────────
// Stores the Rapier rigid-body handle so systems can look it up.
export const RigidBodyRef = defineComponent({ handle: Types.ui32 })

// ─── Tags ────────────────────────────────────────────────────────────────────
// Tag components have no data — presence alone conveys meaning.
export const Player      = defineComponent()
export const Platform    = defineComponent()
export const Goal        = defineComponent()   // reach this to complete the level
export const Hazard      = defineComponent()   // touching this kills the player
export const Grounded    = defineComponent()   // player is on the ground this frame

// ─── Input state (written by InputSystem, read by MovementSystem) ─────────────
export const Input = defineComponent({
  left  : Types.ui8,
  right : Types.ui8,
  jump  : Types.ui8,
})
