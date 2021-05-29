import {
  controller,
  // httpGet,
  httpPut,
  httpPost,
  httpDelete,
} from "inversify-express-utils"
import { authenticate } from "../middleware/auth"
import { validateReq } from "../middleware/validate/joi.middleware"
import { Types } from "../../../types"
import {
  IUserCreateReq,
  IUserCreateSchema,
  userCreateResp,
  IUserUpdateReq,
  IUserUpdateSchema,
  userUpdateResp,
  IUserDeleteReq,
  IUserDeleteSchema,
  userDeleteResp,
  IUserListReq,
  IUserListSchema,
  userListResp,
} from "../req.schema/user.schema"
import { Response } from "express"
import { inject } from "inversify"
import { UserRepository } from "../repository/User.repository"

@controller("/api/user", authenticate)
export class UserController {
  constructor(@inject(Types.UserRepository) private userRepo: UserRepository) { }

  @httpPost(
    "/create",
    validateReq(IUserCreateSchema, {
      apiPath: "/api/user/create",
      tags: ["User"],
      method: "post",
      responses: userCreateResp,
      description: "create user.",
    }),
  )
  async createUser(req: IUserCreateReq, res: Response) {
    const response = await this.userRepo.createUser(req.body, req.files)
    res.json({
      status: 1,
      response,
    })
  }

  @httpPut(
    "/update/:user",
    validateReq(IUserUpdateSchema, {
      apiPath: "/api/user/update/{user}",
      tags: ["User"],
      method: "put",
      responses: userUpdateResp,
      description: "update user.",
    })
  )
  async updateUser(req: IUserUpdateReq, res: Response) {
    await this.userRepo.updateUser(req.params.user, req.body, req.files)
    res.json({
      status: 1,
      message: "User updated",
      response: {},
    })
  }

  @httpDelete(
    "/delete",
    validateReq(IUserDeleteSchema, {
      apiPath: "/api/user/delete",
      tags: ["User"],
      method: "delete",
      responses: userDeleteResp,
      description: "delete user.",
    })
  )
  async deleteUser(req: IUserDeleteReq, res: Response) {
    await this.userRepo.inactivateUser(req.body.userId)
    res.json({
      status: 1,
      response: "User deleted!",
    })
  }

  @httpPost(
    "/list",
    validateReq(IUserListSchema, {
      apiPath: "/api/user/list",
      tags: ["User"],
      method: "post",
      responses: userListResp,
      description: "list users.",
    })
  )
  async listUsers(req: IUserListReq, res: Response) {
    const response = await this.userRepo.listUsers(req.body)
    res.json({ status: 1, response })
  }
}
