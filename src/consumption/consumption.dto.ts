import {
  IsBase64,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsUUID,
} from "class-validator";
import { MeasureType } from "../common/data-types";

export default class ConsumptionDto {
  @IsBase64()
  @IsNotEmpty()
  public image: string;

  @IsUUID()
  @IsNotEmpty()
  public customer_code: string;

  @IsDateString()
  @IsNotEmpty()
  public measure_datetime: string;

  @IsEnum(MeasureType)
  @IsNotEmpty()
  public measure_type: MeasureType;

  constructor(payload: any) {
    this.image = payload?.image;
    this.customer_code = payload?.customer_code;
    this.measure_datetime = payload?.measure_datetime;
    this.measure_type = payload?.measure_type;
  }
}
