import mongoose, { Document } from "mongoose"
export enum TaptapPaymentType {
  NEFT = "NEFT",
  RTGS = "RTGS",
  UPI = "UPI",
  CHEQUE = "CHEQUE",
  CASH = "CASH",
}
export interface IUserDoc extends Document {
  company: mongoose.Types.ObjectId
  branches: mongoose.Types.ObjectId[]
  fleets: mongoose.Types.ObjectId[]
  departments: mongoose.Types.ObjectId[]
  appDepartments: mongoose.Types.ObjectId[]
  /** for attendance/ holiday / leave / salary calculation */
  userTypeId?: mongoose.Types.ObjectId
  name: {
    fName: string
    lName: string
  }
  role: "S" | "A" | "O" | "M"
  dob: Date
  address: {
    l1: string
    l2: string
    city: mongoose.Types.ObjectId
    pincode: number
  }
  active: boolean
  contact: number
  password: string
  email?: string
  reportingManager?: mongoose.Types.ObjectId
  designation?: string
  userShiftDuty?: {
    startTime: Date
    endTime: Date
  }
  otp?: {
    otp: string
    expireDate: Date
  }
  userProfile?: string
  panCard?: string
  aadharCard?: string
  salarySlip?: string
  bankStatement?: string
  agreement?: string
  maxBalance: number
  /** Used in company payment send */
  acceptsPaymentType: TaptapPaymentType[]
}

const userSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "companies",
    required: [true, "Why no company"],
  },
  branches: [
    { type: mongoose.Schema.Types.ObjectId, ref: "branches", required: true },
  ],
  fleets: [
    { type: mongoose.Schema.Types.ObjectId, ref: "fleets", required: true },
  ],
  departments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "departments",
      required: true,
    },
  ],
  appDepartments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "appDepartments",
    },
  ],
  userTypeId: mongoose.Schema.Types.ObjectId,
  name: {
    fName: {
      type: String,
      required: true,
    },
    lName: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "O",
    enum: ["S", "A", "O"],
  },
  dob: Date,
  address: {
    l1: {
      type: String,
      // required: true,
    },
    l2: {
      type: String,
      // required: true,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cities",
      // required: true,
    },
    pincode: {
      type: Number,
      // required: true,
      min: 100000,
      max: 999999,
    },
  },
  active: {
    type: Boolean,
    default: true,
  },
  contact: {
    type: Number,
    required: true,
    min: 1000000000,
    max: 9999999999,
  },
  password: {
    type: String,
    required: true,
  },
  email: String,
  reportingManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  designation: String,
  userShiftDuty: {
    startTime: Date,
    endTime: Date,
  },
  otp: {
    otp: String,
    expireDate: Date,
  },
  userProfile: String,
  panCard: String,
  aadharCard: String,
  salarySlip: String,
  bankStatement: String,
  agreement: String,
  maxBalance: { type: Number, required: false, default: 0 },
  createdAt: { type: Date, default: Date.now },
  acceptsPaymentType: [{ type: String, enum: Object.keys(TaptapPaymentType) }],
})
  .index({ contact: 1 }, { unique: 1 })
  .index({ company: 1, active: 1 })
  .index({ taptapPaymentType: 1 })

export const UserModel = mongoose.model<IUserDoc>("users", userSchema, "users")

export default UserModel
