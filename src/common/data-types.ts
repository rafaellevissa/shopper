export enum MeasureType {
  WATER = "WATER",
  GAS = "GAS",
}

export enum HTTPStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  CONFLICT = 409,
}

export enum HTTPErrorCode {
  DOUBLE_REPORT = "DOUBLE_REPORT",
  INVALID_DATA = "INVALID_DATA",
}

export type ConsumptionUploaded = {
  image_url: string;
  measure_value: number;
  measure_uuid: string;
};
