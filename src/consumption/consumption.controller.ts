import { Request, Response } from "express";
import {
  ConsumptionUploadDto,
  ConsumptionConfirmDto,
  ConsumptionListDto,
} from "./consumption.dto";
import { validateSync } from "class-validator";
import { HTTPErrorCode, HTTPStatusCode } from "../common/data-types";
import ConsumptionService from "./consumption.service";
import { HttpException } from "../common/exception";

export default class ConsumptionController {
  public static async listByCustomer(req: Request, res: Response) {
    try {
      const payload = new ConsumptionListDto(req.query);
      const { customerCode } = req.params;

      const errors = validateSync(payload);

      if (errors.length > 0) {
        throw new HttpException(
          HTTPStatusCode.BAD_REQUEST,
          HTTPErrorCode.INVALID_DATA,
          "Tipo de medição não permitida"
        );
      }

      const consumptionService = new ConsumptionService();

      const consumptions = await consumptionService.listByCustomer(
        customerCode,
        payload.measure_type
      );

      return res.status(HTTPStatusCode.OK).json(consumptions);
    } catch (e) {
      if (e instanceof HttpException) {
        return res.status(e.statusCode).json(e.toObject());
      }

      const internalServerError = new HttpException(
        HTTPStatusCode.INTERNAL_SERVER_ERROR,
        HTTPErrorCode.INTERNAL_SERVER,
        (e as Error).message
      );

      return res
        .status(HTTPStatusCode.INTERNAL_SERVER_ERROR)
        .json(internalServerError);
    }
  }

  public static async confirm(req: Request, res: Response) {
    try {
      const payload = new ConsumptionConfirmDto(req.body);

      const errors = validateSync(payload);

      if (errors.length > 0) {
        throw new HttpException(
          HTTPStatusCode.BAD_REQUEST,
          HTTPErrorCode.INVALID_DATA,
          "Os dados fornecidos no corpo da requisição são inválidos"
        );
      }

      const consumptionService = new ConsumptionService();

      await consumptionService.confirm(
        payload.measure_uuid,
        payload.confirmed_value
      );

      return res.status(HTTPStatusCode.OK).json({ success: true });
    } catch (e) {
      if (e instanceof HttpException) {
        return res.status(e.statusCode).json(e.toObject());
      }

      const internalServerError = new HttpException(
        HTTPStatusCode.INTERNAL_SERVER_ERROR,
        HTTPErrorCode.INTERNAL_SERVER,
        (e as Error).message
      );

      return res
        .status(HTTPStatusCode.INTERNAL_SERVER_ERROR)
        .json(internalServerError);
    }
  }

  public static async upload(req: Request, res: Response) {
    try {
      const payload = new ConsumptionUploadDto(req.body);

      const errors = validateSync(payload);

      if (errors.length > 0) {
        throw new HttpException(
          HTTPStatusCode.BAD_REQUEST,
          HTTPErrorCode.INVALID_DATA,
          "Os dados fornecidos no corpo da requisição são inválidos"
        );
      }

      const consumptionService = new ConsumptionService();

      const consumption = await consumptionService.save(
        payload.image,
        new Date(payload.measure_datetime),
        payload.measure_type,
        payload.customer_code
      );

      return res.status(HTTPStatusCode.OK).json(consumption);
    } catch (e) {
      if (e instanceof HttpException) {
        return res.status(e.statusCode).json(e.toObject());
      }

      const internalServerError = new HttpException(
        HTTPStatusCode.INTERNAL_SERVER_ERROR,
        HTTPErrorCode.INTERNAL_SERVER,
        (e as Error).message
      );

      return res
        .status(HTTPStatusCode.INTERNAL_SERVER_ERROR)
        .json(internalServerError);
    }
  }
}
