import { Request, Response } from "express";
import ConsumptionDto from "./consumption.dto";
import { validateSync } from "class-validator";
import { response } from "../common/utils/http";
import { HTTPStatusCode } from "../common/data-types";
import ConsumptionService from "./consumption.service";

export default class ConsumptionController {
  public static async upload(req: Request, res: Response) {
    const payload = new ConsumptionDto(req.body);

    const errors = validateSync(payload);

    if (errors.length > 0) {
      const responseBody = response(HTTPStatusCode.BAD_REQUEST, errors);
      return res.status(HTTPStatusCode.BAD_REQUEST).json(responseBody);
    }

    const consumptionService = new ConsumptionService();

    const consumption = await consumptionService.save(
      payload.image,
      new Date(payload.measure_datetime),
      payload.measure_type,
      payload.customer_code
    );

    const responseBody = response(HTTPStatusCode.OK, consumption);
    return res.status(HTTPStatusCode.OK).json(responseBody);
  }
}
