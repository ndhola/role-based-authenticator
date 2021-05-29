import mongoose, { Document, Schema } from "mongoose"

export interface IAreaDoc extends Document {
  name: string
  city: mongoose.Types.ObjectId
  pincode: number
}

const areaSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cities",
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
    min: 100000,
    max: 999999,
  },
}).index({
  pincode: 1,
})

export const AreaModel = mongoose.model<IAreaDoc>("areas", areaSchema, "areas")
export default AreaModel
