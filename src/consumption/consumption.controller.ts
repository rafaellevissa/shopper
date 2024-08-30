import { Request, Response } from "express";
import {
  ConsumptionUploadDto,
  ConsumptionConfirmDto,
  ConsumptionListDto,
} from "./consumption.dto";
import { validateSync } from "class-validator";
import { response } from "../common/utils/http";
import { HTTPStatusCode } from "../common/data-types";
import ConsumptionService from "./consumption.service";

export default class ConsumptionController {
  public static async listByCustomer(req: Request, res: Response) {
    const payload = new ConsumptionListDto(req.query);
    const { customerCode } = req.params;

    const errors = validateSync(payload);

    if (errors.length > 0) {
      const responseBody = response(HTTPStatusCode.BAD_REQUEST, errors);
      return res.status(HTTPStatusCode.BAD_REQUEST).json(responseBody);
    }

    const consumptionService = new ConsumptionService();

    const consumptions = await consumptionService.listByCustomer(
      customerCode,
      payload.measure_type
    );

    const responseBody = response(HTTPStatusCode.OK, consumptions);
    return res.status(HTTPStatusCode.OK).json(responseBody);
  }

  public static async confirm(req: Request, res: Response) {
    const payload = new ConsumptionConfirmDto(req.body);

    const errors = validateSync(payload);

    if (errors.length > 0) {
      const responseBody = response(HTTPStatusCode.BAD_REQUEST, errors);
      return res.status(HTTPStatusCode.BAD_REQUEST).json(responseBody);
    }

    const consumptionService = new ConsumptionService();

    await consumptionService.confirm(
      payload.measure_uuid,
      payload.confirmed_value
    );

    const responseBody = response(HTTPStatusCode.OK, { success: true });
    return res.status(HTTPStatusCode.OK).json(responseBody);
  }

  public static async upload(req: Request, res: Response) {
    const payload = new ConsumptionUploadDto(req.body);

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
