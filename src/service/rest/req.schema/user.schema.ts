import Joi from "@hapi/joi"
import { IAuthenticatedRequest } from "../middleware/auth"
import {
  IRequestSchema,
  IName,
  JoiNameSchema,
  joi400Resp,
  joi401Resp,
} from "../middleware/validate/joi.middleware"
import UserModel from "../../../db/models/userMaster"
import { objectIdRegex } from "../../../constants"
import { UploadedFile } from "express-fileupload"
import { imageNPdfJoiSchema } from "./common.schema"

export interface IUserCreateReq extends IAuthenticatedRequest {
  body: {
    companyId?: string
    userShiftDuty?: {
      startTime?: string
      endTime?: string
    }
    designation?: string
    reportingManager?: string
    active: boolean
    name: IName
    contact: number
    password: string
    dob: Date
    email: string | ""
    maxBalance: number
    userTypeId?: string
  }
  files: {
    userProfile?: UploadedFile
    panCard?: UploadedFile
    aadharCard?: UploadedFile
    salarySlip?: UploadedFile
    bankStatement?: UploadedFile
    agreement?: UploadedFile
  }
}

export const IUserCreateSchema: IRequestSchema = {
  body: Joi.object({
    companyId: Joi.string().regex(objectIdRegex).optional(),
    userShiftDuty: Joi.object({
      startTime: Joi.string().allow("", null).empty(["", null]).optional(),
      endTime: Joi.string().allow("", null).empty(["", null]).optional(),
    }).optional(),
    designation: Joi.string().allow("", null).empty(["", null]).optional(),
    reportingManager: Joi.string().allow("", null).empty(["", null]).optional(),
    active: Joi.bool().valid(true, false),
    name: JoiNameSchema,
    contact: Joi.number().min(1000000000).max(9999999999).required(),
    password: Joi.string().min(6).max(12).allow(""),
    dob: Joi.date().allow(""),
    email: Joi.string().email().allow(""),
    maxBalance: Joi.number().min(0).required(),
    userTypeId: Joi.string().regex(objectIdRegex).allow(""),
  }),
  files: Joi.object({
    userProfile: imageNPdfJoiSchema,
    panCard: imageNPdfJoiSchema,
    aadharCard: imageNPdfJoiSchema,
    salarySlip: imageNPdfJoiSchema,
    bankStatement: imageNPdfJoiSchema,
    agreement: imageNPdfJoiSchema,
  }),
}

export const userCreateResp = Joi.object({
  "200": Joi.object({
    status: Joi.number().valid(1).required(),
    response: Joi.object().meta({
      className: UserModel.modelName,
      classTarget: "definitions",
    }),
  }),
  "400": joi400Resp,
  "401": joi401Resp,
})

export interface IUserUpdateReq extends IAuthenticatedRequest {
  params: {
    user: string
  }
  body: {
    companyId?: string
    userShiftDuty?: {
      startTime?: string
      endTime?: string
    }
    designation?: string
    reportingManager?: string
    active: boolean
    name: IName
    dob: Date
    email: string | ""
    maxBalance: number
    userTypeId?: string
  }
  files: {
    userProfile?: UploadedFile
    panCard?: UploadedFile
    aadharCard?: UploadedFile
    salarySlip?: UploadedFile
    bankStatement?: UploadedFile
    agreement?: UploadedFile
  }
}

export const IUserUpdateSchema: IRequestSchema = {
  params: Joi.object({
    user: Joi.string().regex(objectIdRegex).required(),
  }),
  body: Joi.object({
    companyId: Joi.string().regex(objectIdRegex).optional(),
    userShiftDuty: {
      startTime: Joi.string().allow("", null).empty(["", null]).optional(),
      endTime: Joi.string().allow("", null).empty(["", null]).optional(),
    },
    designation: Joi.string().allow("", null).empty(["", null]).optional(),
    reportingManager: Joi.string().allow("", null).empty(["", null]).optional(),
    active: Joi.bool().valid(true, false),
    name: JoiNameSchema,
    dob: Joi.date().allow(""),
    email: Joi.string().email().allow(""),
    maxBalance: Joi.number().min(0).required(),
    userTypeId: Joi.string().regex(objectIdRegex).allow(""),
  }),
  files: Joi.object({
    userProfile: imageNPdfJoiSchema,
    panCard: imageNPdfJoiSchema,
    aadharCard: imageNPdfJoiSchema,
    salarySlip: imageNPdfJoiSchema,
    bankStatement: imageNPdfJoiSchema,
    agreement: imageNPdfJoiSchema,
  }),
}

export const userUpdateResp = Joi.object({
  "200": Joi.object({
    status: Joi.number().valid(1).required(),
    message: Joi.string(),
    response: Joi.object({}),
  }),
  "400": joi400Resp,
  "401": joi401Resp,
})

export interface IUserDeleteReq extends IAuthenticatedRequest {
  body: {
    userId: string
  }
}

export const IUserDeleteSchema: IRequestSchema = {
  body: Joi.object({
    userId: Joi.string().regex(objectIdRegex).required(),
  }),
}

export const userDeleteResp = Joi.object({
  "200": Joi.object({
    status: Joi.number().valid(1).required(),
    response: Joi.string().valid("User deleted!").required(),
  }),
  "400": joi400Resp,
  "401": joi401Resp,
})

export interface IUserListReq extends IAuthenticatedRequest {
  body: {
    companyId?: string
    branch?: string
    status?: "Active" | "Inactive"
  }
}

export const IUserListSchema: IRequestSchema = {
  body: Joi.object({
    companyId: Joi.string().allow("").regex(objectIdRegex).optional(),
    branch: Joi.string().allow("").regex(objectIdRegex).optional(),
    status: Joi.string()
      .valid("Active", "Inactive")
      .allow("")
      .default("Active"),
  }),
}

export const userListResp = Joi.object({
  "200": Joi.object({
    status: Joi.number().valid(1).required(),
    response: Joi.array().items(
      Joi.object({
        _id: Joi.string().regex(objectIdRegex).required(),
        name: JoiNameSchema,
        contact: Joi.number()
          .integer()
          .min(1000000000)
          .max(9999999999)
          .required(),
      })
    ),
  }),
  "400": joi400Resp,
  "401": joi401Resp,
})

export interface IUserViewByContactReq extends IAuthenticatedRequest {
  body: {
    contact: number
    franchise?: boolean
  }
}

export const IUserViewByContactSchema: IRequestSchema = {
  body: Joi.object({
    contact: Joi.number().integer().min(1000000000).max(9999999999).required(),
    franchise: Joi.bool().allow(true, false).optional(),
  }),
}

export const userViewByContactResp = Joi.object({
  "200": Joi.object({
    status: Joi.number().valid(1).required(),
    response: (IUserCreateSchema.body as Joi.ObjectSchema).keys({
      departments: Joi.array().items(
        Joi.object({
          _id: Joi.string().required(),
          departmentName: Joi.string().required(),
        })
      ),
      branches: Joi.array().items(
        Joi.object({
          _id: Joi.string().required(),
          branchName: Joi.string().required(),
          shortName: Joi.string().required(),
        })
      ),
      fleets: Joi.array().items(
        Joi.object({
          _id: Joi.string().required(),
          regNumber: Joi.string().required(),
          shortName: Joi.string().required(),
        })
      ),
      userProfile: Joi.string(),
      panCard: Joi.string(),
      aadharCard: Joi.string(),
      salarySlip: Joi.string(),
      bankStatement: Joi.string(),
      agreement: Joi.string(),
    }),
  }),
  "400": joi400Resp,
  "401": joi401Resp,
})

export interface IUserViewByIDReq extends IAuthenticatedRequest {
  params: {
    user: string
  }
}

export const IUserViewByIDSchema: IRequestSchema = {
  params: Joi.object({
    user: Joi.string().regex(objectIdRegex).required(),
  }),
}

export const userViewByIDResp = Joi.object({
  "200": Joi.object({
    status: Joi.number().valid(1).required(),
    response: IUserCreateSchema.body as Joi.ObjectSchema,
  }),
  "400": joi400Resp,
  "401": joi401Resp,
})

export interface IUserAssignDepartmentReq extends IAuthenticatedRequest {
  body: {
    userId: string
    departments: string[]
  }
}

export const IUserAssignDepartmentSchema: IRequestSchema = {
  body: Joi.object({
    userId: Joi.string().regex(objectIdRegex).required(),
    departments: Joi.array()
      .items(Joi.string().regex(objectIdRegex).required())
      .required(),
  }),
}

export const userAssignDepartmentResp = Joi.object({
  "200": Joi.object({
    status: Joi.number().valid(1).required(),
    response: Joi.object().meta({
      className: UserModel.modelName,
      classTarget: "definitions",
    }),
  }),
  "400": joi400Resp,
  "401": joi401Resp,
})

export interface IUserDeleteDepartmentReq extends IAuthenticatedRequest {
  body: {
    userId: string
    departments: string[]
  }
}

export const IUserDeleteDepartmentSchema: IRequestSchema = {
  body: Joi.object({
    userId: Joi.string().regex(objectIdRegex).required(),
    departments: Joi.array()
      .items(Joi.string().regex(objectIdRegex).required())
      .required(),
  }),
}

export const userDeleteDepartmentResp = Joi.object({
  "200": Joi.object({
    status: Joi.number().valid(1).required(),
    response: Joi.object().meta({
      className: UserModel.modelName,
      classTarget: "definitions",
    }),
  }),
  "400": joi400Resp,
  "401": joi401Resp,
})

export interface IListUsersByIdsReq extends IAuthenticatedRequest {
  body: {
    arr: string[]
  }
}

export const IListUsersByIdsSchema: IRequestSchema = {
  body: Joi.object({
    arr: Joi.array()
      .items(Joi.string().regex(objectIdRegex).required())
      .required(),
  }),
}

export const listUsersByIdsResp = Joi.object({
  "200": Joi.object({
    status: Joi.number().valid(1).required(),
    response: Joi.array().items(
      (IUserCreateSchema.body as Joi.ObjectSchema).keys({
        company: Joi.object({
          _id: Joi.string().regex(objectIdRegex).required(),
          companyName: Joi.string().required(),
        }),
      })
    ),
  }),
  "400": joi400Resp,
  "401": joi401Resp,
})

export const taptapPaymentUserResp = Joi.object({
  "200": Joi.object({
    status: Joi.number().valid(1).required(),
    response: Joi.array().items(
      Joi.object().meta({
        className: UserModel.modelName,
        classTarget: "definitions",
      })
    ),
  }),
  "400": joi400Resp,
  "401": joi401Resp,
})
