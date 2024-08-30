import { response } from "./http";
import { HTTPErrorCode, HTTPStatusCode } from "../data-types";

describe("response", () => {
  it("should return error object for status code >= 400", () => {
    const result = response(HTTPStatusCode.BAD_REQUEST, "Invalid data");
    expect(result).toEqual({
      error_code: HTTPErrorCode.INVALID_DATA,
      error_description: "Invalid data",
    });
  });

  it("should return data for status code < 400", () => {
    const result = response(HTTPStatusCode.OK, { id: 1, name: "Item" });
    expect(result).toEqual({ id: 1, name: "Item" });
  });

  it("should return the correct error code for CONFLICT status code", () => {
    const result = response(HTTPStatusCode.CONFLICT, "Conflict detected");
    expect(result).toEqual({
      error_code: HTTPErrorCode.DOUBLE_REPORT,
      error_description: "Conflict detected",
    });
  });
});
