import app from "#app.js";
import { carrierService } from "#libs/CarrierServices/CarrierServices.js";
import { RateQuery, ResRateFromApi } from "#types/ShippingRate.js";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";

describe("Rate endpoint", () => {
  const getRateSpy = vi.spyOn(carrierService, "getRate");

  const validBody: RateQuery = {
    destination: { AddressLine: ["123 St"], CountryCode: "US" },
    dimensions: { Height: "10.00", Length: "10.00", UnitOfMeasurement: { Code: "IN", Description: "Inches" }, Width: "10.00" },
    packageWeight: { UnitOfMeasurement: { Code: "LBS", Description: "Pounds" }, Weight: "10.00" },
    shipper: { AddressLine: ["321 St"], CountryCode: "US" },
  };

  describe("Succesfull rate check", () => {
    it("should return 200 and rate data when carrierService returns a valid rate check", async () => {
      const mockRateResponse = {
        carrierName: "UPS",
        currencyCode: "USD",
        deliveryDays: "2",
        monetaryValue: "100.00",
        scheduledDeliveryDate: "2023-10-27",
      };

      getRateSpy.mockResolvedValue(mockRateResponse);

      const res = await request(app).post("/api/v1.0/rate").send(validBody);

      expect(res.statusCode).toEqual(200);
      expect(res.body as ResRateFromApi).toEqual({
        data: mockRateResponse,
        message: "Rate obtained successfully",
        status: true,
      });
      expect(getRateSpy).toHaveBeenCalledWith("UPS", validBody);
    });
  });

  describe("Failed rate check", () => {
    it("should return 422 if body is empty", async () => {
      const res = await request(app).post("/api/v1.0/rate").send();

      expect(res.statusCode).toEqual(422);
      expect((res.body as ResRateFromApi).message).toContain("Missing data in request body");
    });

    it("should return 422 if a field is wrong (invalid type)", async () => {
      const invalidBody = { ...validBody, dimensions: { ...validBody.dimensions, Height: "invalid" } };
      const res = await request(app).post("/api/v1.0/rate").send(invalidBody);

      expect(res.statusCode).toEqual(422);
      expect((res.body as ResRateFromApi).message).toContain("Validation failed");
    });

    it("should return 422 if a field is missing (required field)", async () => {
      const missingFieldBody = { destination: { AddressLine: ["123 St"], CountryCode: "US" } };

      const res = await request(app).post("/api/v1.0/rate").send(missingFieldBody);

      expect(res.statusCode).toEqual(422);
      expect((res.body as ResRateFromApi).message).toContain("Validation failed");
    });

    it("should return 500 if internal error occurs (service throws)", async () => {
      getRateSpy.mockRejectedValue(new Error("Service failure"));

      const res = await request(app).post("/api/v1.0/rate").send(validBody);

      expect(res.statusCode).toEqual(500);
      expect((res.body as ResRateFromApi).message).toEqual("Internal Server Error");
    });

    it("should return appropriate error code from service (e.g. 400)", async () => {
      getRateSpy.mockResolvedValue({ errors: ["Bad Request"], statusCode: 400 });

      const res = await request(app).post("/api/v1.0/rate").send(validBody);

      expect(res.statusCode).toEqual(400);
      expect(res.body as ResRateFromApi).toEqual({
        errors: ["Bad Request"],
        message: "Error obtaining rate",
        status: false,
      });
    });
  });
});
