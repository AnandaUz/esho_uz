import mongoose, { Schema, Document } from 'mongoose'

export interface IGuest extends Document<string> {
  _id: string          // session id
  createdAt: Date
  ua?: string            // user agent

  tg?: {
    id: string
    first_name?: string
    last_name?: string
    username?: string
  }
  instagram?: {
    pixel?:boolean
    fbp?: string          // _fbp cookie от Facebook
    fbc?: string          // _fbc cookie
    comp_name?: string
    adset_name?: string
    ad_name?: string
  }
  maxScroll?: number     // максимальный скролл %
  duration?: number      // время на странице в секундах
  events?: [number, number][]  // [[время, код], ...]
}

const GuestSchema = new Schema<IGuest>({
  _id:       { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  ua:        { type: String },
  tg: {
    id: { type: String },
    first_name: { type: String },
    last_name: { type: String },
    username: { type: String },
  },
  instagram: {
    pixel: { type: Boolean },
    fbp: { type: String },
    fbc: { type: String },
    comp_name: { type: String },
    adset_name: { type: String },
    ad_name: { type: String },
  },
  maxScroll: { type: Number },
  duration:  { type: Number },
  events:    { type: [[Number]] },
})

GuestSchema.index({ 'instagram.comp_name': 1 })

export default mongoose.model<IGuest>('Guests', GuestSchema)