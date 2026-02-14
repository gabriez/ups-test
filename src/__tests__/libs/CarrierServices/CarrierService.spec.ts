import { CarrierServicesStrategy } from "#libs/CarrierServices/CarrierServices.js";
import { CarrierService } from "#types/carrierService.js";
import { RateQuery } from "#types/ShippingRate.js";
import { describe, expect, it, vi } from "vitest";

describe("CarrierServicesStrategy", () => {
  it("should add and retrieve a carrier service", () => {
    const strategy = new CarrierServicesStrategy();
    const mockService = { getRate: vi.fn(), name: "TestService" } as unknown as CarrierService;

    strategy.addCarrierService("TEST", mockService);

    expect(strategy.getCarrierServiceById("TEST")).toBe(mockService);
  });

  it("should return null for non-existent carrier service", () => {
    const strategy = new CarrierServicesStrategy();
    expect(strategy.getCarrierServiceById("NON_EXISTENT")).toBeNull();
  });

  it("should delete a carrier service", () => {
    const strategy = new CarrierServicesStrategy();
    const mockService = { getRate: vi.fn(), name: "TestService" } as unknown as CarrierService;

    strategy.addCarrierService("TEST", mockService);
    strategy.deleteCarrierServiceById("TEST");

    expect(strategy.getCarrierServiceById("TEST")).toBeNull();
  });

  it("should call getRate on the correct service", async () => {
    const strategy = new CarrierServicesStrategy();
    const mockService = { getRate: vi.fn().mockResolvedValue({ success: true }), name: "TestService" } as unknown as CarrierService;

    strategy.addCarrierService("TEST", mockService);

    const rateQuery = {} as unknown as RateQuery;
    const result = await strategy.getRate("TEST", rateQuery);

    expect(mockService.getRate).toHaveBeenCalledWith(rateQuery);
    expect(result).toEqual({ success: true });
  });

  it("should throw error when getting rate for non-existent service", async () => {
    const strategy = new CarrierServicesStrategy();
    const rateQuery = {} as unknown as RateQuery;

    await expect(strategy.getRate("NON_EXISTENT", rateQuery)).rejects.toThrow("Carrier service with ID NON_EXISTENT not found");
  });
});
