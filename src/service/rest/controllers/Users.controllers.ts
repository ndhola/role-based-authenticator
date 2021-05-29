import { inject } from "inversify";
import { controller, httpPost, httpPut } from "inversify-express-utils";
import { Types } from "../../../types";
import { validateReq } from "../middleware/validate/joi.middleware";
import { UserRepository } from "../repository/Users.repository";
import { IRegistrationRequest, IRegistrationSchema, IUpdateUserRequest, IUpdateUserSchema, registerUserResponseSchema, updateUserResp } from "../req.schema/users.schema";
import { Response } from "express"

@controller("/api/user")
export class UserController {
    constructor(@inject(Types.UserRepository) private userRepo: UserRepository) { }

    @httpPost(
        "/register",
        validateReq(IRegistrationSchema, {
            apiPath: "/api/user/register",
            tags: ["User"],
            responses: registerUserResponseSchema,
            method: "post",
            description: "Register New User",
        }),
    )
    async registerUser(req: IRegistrationRequest, res: Response) {
        const response = await this.userRepo.registerUser(req.body)
        res.json({ status: 1, response })
    }

    @httpPut("/update/:userId", validateReq(IUpdateUserSchema, {
        apiPath: "/api/user/update/{userId}",
        tags: ["User"],
        method: "put",
        responses: updateUserResp,
        description: "Update User",
    }))
    async updateUser(req: IUpdateUserRequest, res: Response) {
        await this.userRepo.updateUser(req.params.userId, req.body)
        res.json({
            status: 1,
            message: "User Updated",
            response: {}
        })
    }
}