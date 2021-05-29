import { injectable } from "inversify"
import bcrypt from "bcryptjs"
import { UserModel, IUserDoc } from "../../../db/models/user"
import * as auth from "../middleware/auth"
import { InvalidInput } from "../../../utilities/customError"
import { genHash } from "../helpers/hash"
import { IVerifyOTPReq, ILoginReq } from "../req.schema/login.schema"

@injectable()
export class LoginRepository {
  async login(reqData: ILoginReq["body"]) {
    const { username, password } = reqData
    let matcher = {}
    if (/^\d+$/.test(username)) {
      matcher = {
        number: +username,
      }
    } else {
      matcher = {
        email: username,
      }
    }
    const users = await UserModel.aggregate<IUserDoc>([
      {
        $match: matcher,
      },
    ])
    if (users.length !== 1) {
      throw new InvalidInput("Invalid Username or Password!")
    }
    const user = users[0]
    if (!(await bcrypt.compare(password, user.password as string))) {
      throw new InvalidInput("Invalid Username or Password!")
    }

    const role = user.role
    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)

    const monthStartDate = new Date()
    monthStartDate.setDate(1)
    monthStartDate.setHours(0, 0, 0, 0)

    const payload = {
      user: user._id.toHexString(),
      role: user.role
    }
    return {
      response: {
        user,
      },
      accessToken: auth.sign(payload),
      username,
      role,
    }
  }

  generateOPT() {
    const digits = "0123456789"
    let OTP = ""
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)]
    }
    return OTP
  }
  async forgotPassword(number: number) {
    const getUser = await UserModel.findOne({
      number,
      // active: true,
    })
    if (!getUser) throw new InvalidInput("No such user found")

    const getOtp = this.generateOPT()
    const date = new Date()
    date.setMinutes(date.getMinutes() + 10)

    await UserModel.updateOne(
      {
        number,
      },
      {
        otp: {
          otp: getOtp,
          expireDate: date,
        },
      },
      {
        new: true,
      }
    )

    // return sendMsg({
    //   message: `${getOtp} is the Onetime password(OTP) for your reset password. Pls do not share this with anyone.`,
    //   contact,
    // })
  }

  async verifyOTP(
    reqBody: IVerifyOTPReq["body"],
    ip: string,
    userAgent: string
  ) {
    const { number, OTP } = reqBody
    const userDoc = await UserModel.findOne({
      number,
      // active: true,
    })
    if (
      !userDoc ||
      !userDoc.otp ||
      !userDoc.otp.expireDate ||
      userDoc.otp.expireDate.getTime() < new Date().getTime()
    ) {
      throw new InvalidInput("Invalid user or OTP.")
    }
    if (userDoc.otp.otp !== OTP) {
      throw new InvalidInput("Invalid or expired otp.")
    }
  }

  async setPassword(password: string, number: number, OTP: string) {
    const userDoc = await UserModel.findOne({
      number,
      active: true,
    })
    if (!userDoc) {
      throw new InvalidInput("Invalid user.")
    }
    if (!userDoc.otp) {
      throw new InvalidInput("Invalid or expired otp.")
    }
    if (
      !userDoc.otp.expireDate ||
      userDoc.otp.expireDate.getTime() < new Date().getTime()
    ) {
      throw new InvalidInput("Invalid or expired otp.")
    }
    if (userDoc.otp.otp !== OTP) {
      throw new InvalidInput("Invalid or expired otp.")
    }

    const setUserPassword = await UserModel.updateOne(
      { number: Number(number) },
      { password: await genHash(password, 10) }
    )

    return setUserPassword
  }

  async changePassword(contact: number, password: string, newPassword: string) {
    const getUser: any = await UserModel.findOne({
      contact,
      active: true,
    })
    if (!getUser) {
      throw new InvalidInput("User doesn't exist")
    }
    if (!(await bcrypt.compare(password, getUser.password))) {
      throw new InvalidInput("password doesn't match")
    }
    return UserModel.updateOne(
      { contact },
      { password: await genHash(newPassword, 10) },
      { new: true }
    )
  }
}
