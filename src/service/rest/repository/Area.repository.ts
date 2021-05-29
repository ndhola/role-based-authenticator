import { injectable } from "inversify"
import AreaModel from "../../../db/models/areaMaster"
import { InvalidInput } from "../../../utilities/customError"
import { ReadPreference } from "mongodb"

@injectable()
export class AreaRepository {
  async createArea(name: string, city: string, pincode: number) {
    return AreaModel.create({
      name,
      city,
      pincode,
    })
  }

  async updateArea(id: string, name: string, city: string, pincode: number) {
    return AreaModel.findByIdAndUpdate(id, {
      name,
      city,
      pincode,
    })
  }

  async deleteArea(id: string) {
    return AreaModel.findByIdAndDelete(id)
  }

  async viewArea(id: string) {
    return AreaModel.findById(id).read(ReadPreference.SECONDARY_PREFERRED)
  }

  async getCityByPincode(pincode: string) {
    const area = await AreaModel.aggregate([
      {
        $match: {
          pincode: Number(pincode),
        },
      },
      {
        $limit: 1,
      },
      {
        $lookup: {
          from: "cities",
          localField: "city",
          foreignField: "_id",
          as: "city",
        },
      },
    ]).read(ReadPreference.SECONDARY_PREFERRED)
    if (!area || area.length !== 1) {
      return Promise.reject(new InvalidInput("Pincode not found."))
    }
    return area[0].city[0]
  }
}
