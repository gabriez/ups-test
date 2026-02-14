import { ratingController } from "#controllers/ratingController.js";
import { carrierService } from "#libs/CarrierServices/CarrierServices.js";
import { RateQuery, ReqRateValidated, ResRate } from "#types/ShippingRate.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("ratingController", () => {
  let req: Partial<ReqRateValidated>;
  let res: Partial<ResRate>;
  let jsonMock: ReturnType<typeof vi.fn>;
  let statusMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    req = {
      body: {
        destination: { AddressLine: [], CountryCode: "US", PostalCode: "12345" },
        dimensions: { Height: "10", Length: "10", UnitOfMeasurement: { Code: "IN", Description: "Inches" }, Width: "10" },
        packageWeight: { UnitOfMeasurement: { Code: "LBS", Description: "Pounds" }, Weight: "10" },
        shipper: { AddressLine: [], CountryCode: "US", PostalCode: "54321" },
      } as RateQuery,
    };

    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });

    res = {
      status: statusMock,
    } as unknown as ResRate; // Cast because express Response is complex to fully mock
  });

  it("should return 200 and rate data when carrierService returns a valid rate check 1", async () => {
    const mockRateResponse = {
      carrierName: "UPS",
      currencyCode: "USD",
      deliveryDays: "2",
      monetaryValue: "100.00",
      scheduledDeliveryDate: "2023-10-27",
    };

    vi.spyOn(carrierService, "getRate").mockResolvedValue(mockRateResponse);

    await ratingController(req as ReqRateValidated, res as ResRate);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      data: mockRateResponse,
      message: "Rate obtained successfully",
      status: true,
    });
  });

  it("should return the error status code when carrierService returns an error", async () => {
    const mockErrorResponse = {
      errors: ["Invalid address"],
      statusCode: 400,
    };

    vi.spyOn(carrierService, "getRate").mockResolvedValue(mockErrorResponse);

    await ratingController(req as ReqRateValidated, res as ResRate);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      errors: ["Invalid address"],
      message: "Error obtaining rate",
      status: false,
    });
  });

  it("should return 500 when carrierService throws an unexpected error", async () => {
    vi.spyOn(carrierService, "getRate").mockRejectedValue(new Error("Unexpected error"));

    await ratingController(req as ReqRateValidated, res as ResRate);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      errors: ["Internal Server Error"],
      message: "Internal Server Error",
      status: false,
    });
  });
});
