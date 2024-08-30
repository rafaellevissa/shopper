import { HTTPErrorCode, HTTPStatusCode } from "./data-types";

export class HttpException extends Error {
  constructor(
    public readonly statusCode: HTTPStatusCode,
    public readonly errorCode: HTTPErrorCode,
    public readonly errorDescription: string = ""
  ) {
    super(errorDescription);
  }

  public toObject() {
    return {
      error_code: this.errorCode,
      error_description: this.errorDescription,
    };
  }
}
