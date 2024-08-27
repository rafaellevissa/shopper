import { HTTPErrorCode, HTTPStatusCode } from "../data-types";

function mapStatusCodeToErrorCode(
  statusCode: HTTPStatusCode
): HTTPErrorCode | string {
  switch (statusCode) {
    case HTTPStatusCode.BAD_REQUEST:
      return HTTPErrorCode.INVALID_DATA;
    case HTTPStatusCode.CONFLICT:
      return HTTPErrorCode.DOUBLE_REPORT;
    default:
      return statusCode.toString();
  }
}

export function response(statusCode: HTTPStatusCode, data: any) {
  if (statusCode >= 400) {
    return {
      error_code: mapStatusCodeToErrorCode(statusCode),
      error_description: data,
    };
  }

  return data;
}
