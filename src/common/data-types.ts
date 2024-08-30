import ConsumptionEntity from "../consumption/consumption.entity";

export enum MeasureType {
  WATER = "WATER",
  GAS = "GAS",
}

export enum HTTPStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export enum HTTPErrorCode {
  DOUBLE_REPORT = "DOUBLE_REPORT",
  CONFIRMATION_DUPLICATE = "CONFIRMATION_DUPLICATE",
  INVALID_DATA = "INVALID_DATA",
  MEASURE_NOT_FOUND = "MEASURE_NOT_FOUND",
  MEASURES_NOT_FOUND = "MEASURES_NOT_FOUND",
  INTERNAL_SERVER = "INTERNAL_SERVER",
}

export type ConsumptionUploaded = {
  image_url: string;
  measure_value: number;
  measure_uuid: string;
};

export type ConsumptionList = {
  customer_code: string;
  measures: ConsumptionEntity[];
};
