import { defineComponent, Types } from 'bitecs'

export const Position   = defineComponent({ x: Types.f32, y: Types.f32 })
export const Velocity   = defineComponent({ x: Types.f32, y: Types.f32 })
export const RigidBodyRef = defineComponent({ handle: Types.ui32 })

export const Player   = defineComponent()
export const Platform = defineComponent()
export const Goal     = defineComponent()
export const Hazard   = defineComponent()
export const Grounded = defineComponent()

export const Input = defineComponent({
  left  : Types.ui8,
  right : Types.ui8,
  jump  : Types.ui8,
})