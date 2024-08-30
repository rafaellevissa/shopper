import {
  IsBase64,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from "class-validator";
import { MeasureType } from "../common/data-types";

export class ConsumptionUploadDto {
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

export class ConsumptionConfirmDto {
  @IsUUID()
  @IsNotEmpty()
  public measure_uuid: string;

  @IsInt()
  @IsNotEmpty()
  public confirmed_value: number;

  constructor(payload: any) {
    this.measure_uuid = payload?.measure_uuid;
    this.confirmed_value = payload?.confirmed_value;
  }
}

export class ConsumptionListDto {
  @IsEnum(MeasureType)
  @IsOptional()
  public measure_type: MeasureType;

  constructor(payload: any) {
    this.measure_type = payload?.measure_type?.toUpperCase();
  }
}
