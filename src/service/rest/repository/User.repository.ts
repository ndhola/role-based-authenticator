import { injectable } from "inversify"
import { genHash } from "../helpers/hash"
import {
  IUserCreateReq,
  IUserListReq,
  IUserUpdateReq,
} from "../req.schema/user.schema"
import { UserModel } from "../../../db/models/userMaster"
// import { InvalidInput } from "../../../utilities/customError"

@injectable()
export class UserRepository {
  generateRandomPassword() {
    return `${Math.random()}`
  }
  async createUser(
    {
      userShiftDuty,
      designation,
      reportingManager,
      active,
      name,
      contact,
      dob,
      email,
      maxBalance,
      userTypeId,
    }: IUserCreateReq["body"],
    userFiles?: IUserCreateReq["files"]
  ) {
    const userDoc: { [k: string]: any } = {
      userShiftDuty,
      designation,
      reportingManager,
      active,
      name,
      contact,
      dob,
      email,
      maxBalance,
    }
    if (userTypeId) {
      userDoc.userTypeId = userTypeId
    }
    const password = await genHash(
      userDoc.password || this.generateRandomPassword(),
      10
    )
    const images: { [k: string]: string } = {}
    if (userFiles) {
      for (const [, fileInfo] of Object.entries(userFiles)) {
        if (fileInfo) {
          // images[key] = await sendToS3andGetUrl(
          //   "userFiles/" + company,
          //   fileInfo.data,
          //   fileInfo.name
          // )
        }
      }
    }
    const result = await UserModel.create({
      ...userDoc,
      password,
      ...images,
    })
    return result
  }

  async updateUser(
    user: string,
    userDoc: IUserUpdateReq["body"],
    userFiles?: IUserUpdateReq["files"]
  ) {
    // const images: { [k: string]: string } = {}
    if (userFiles) {
      for (const [, fileInfo] of Object.entries(userFiles)) {
        if (fileInfo) {
          // images[key] = await sendToS3andGetUrl(
          //   "userProfile/" + company,
          //   fileInfo.data,
          //   fileInfo.name
          // )
        }
      }
    }
    // const updtRes = await UserModel.updateOne(
    //   {
    //     _id: user,
    //   },
    //   {
    //     $set: {
    //       ...userDoc,
    //       ...images,
    //     },
    //   }
    // )
    // if (updtRes.n !== 1) {
    //   throw new InvalidInput("No user found to update")
    // }
    return Promise.resolve()
  }

  async inactivateUser(user: string) {
    return UserModel.updateOne(
      {
        _id: user,
      },
      {
        active: false,
      }
    )
  }

  async listUsers(reqBody: IUserListReq["body"]) {
    const { branch, status } = reqBody
    const condition: { [k: string]: any } = {
      name: { $exists: true }, // just to be safe
      contact: { $exists: true }, // just to be safe
    }
    if (status) {
      condition.active = status === "Active" ? true : false
    }
    if (branch) {
      condition.branches = branch
    }
    return UserModel.find(condition, { name: 1, contact: 1 })
  }
}
