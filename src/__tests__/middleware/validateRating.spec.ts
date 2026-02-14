import type { RateQuery, ReqRateValidation } from "#types/ShippingRate.js";

import { validateRating } from "#middleware/validateRating.js";
import { ResponseAPI } from "#types/express.js";
import { NextFunction } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("validateRating", () => {
  let req: Partial<ReqRateValidation>;
  let res: Partial<ResponseAPI>;
  let next: NextFunction;
  let jsonMock: ReturnType<typeof vi.fn>;
  let statusMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    req = {
      body: {} as RateQuery,
    };
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    res = {
      status: statusMock,
    } as unknown as ResponseAPI;
    next = vi.fn();
  });

  it("should call next() when request body is valid", () => {
    const body: RateQuery = {
      destination: { AddressLine: ["123 St"], CountryCode: "US" },
      dimensions: { Height: "10.00", Length: "10.00", UnitOfMeasurement: { Code: "IN", Description: "Inches" }, Width: "10.00" },
      packageWeight: { UnitOfMeasurement: { Code: "LBS", Description: "Pounds" }, Weight: "10.00" },
      shipper: { AddressLine: ["321 St"], CountryCode: "US" },
    };

    req.body = body;

    validateRating(req as ReqRateValidation, res as ResponseAPI, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should return 422 when request body is missing", () => {
    req.body = undefined;

    validateRating(req as ReqRateValidation, res as ResponseAPI, next);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Missing data in request body",
        status: false,
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 422 when validation fails (missing required fields)", () => {
    req.body = {} as unknown as RateQuery; // Empty body, missing all required fields

    validateRating(req as ReqRateValidation, res as ResponseAPI, next);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Validation failed for request body",
        status: false,
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 422 when validation fails (invalid data types)", () => {
    req.body = {
      destination: { AddressLine: ["123 St"], CountryCode: "US" },
      dimensions: { Height: "invalid", Length: "10.00", UnitOfMeasurement: { Code: "IN", Description: "Inches" }, Width: "10.00" }, // Invalid Height
      packageWeight: { UnitOfMeasurement: { Code: "LBS", Description: "Pounds" }, Weight: "10.00" },
      shipper: { AddressLine: ["321 St"], CountryCode: "US" },
    } as unknown as RateQuery;

    validateRating(req as ReqRateValidation, res as ResponseAPI, next);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Validation failed for request body",
        status: false,
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });
});
