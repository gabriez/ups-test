import type { RateQuery } from "#types/ShippingRate.js";

import UPSService from "#libs/CarrierServices/UPSService.js";
import { UpsAuth } from "#libs/UpsAuth.js";
import { HttpClient } from "#types/httpClient.js";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";

describe("UPSService", () => {
  let httpClient: HttpClient;
  let upsAuth: UpsAuth;
  let service: UPSService;

  beforeEach(() => {
    httpClient = { post: vi.fn() } as unknown as HttpClient;
    upsAuth = { getToken: vi.fn() } as unknown as UpsAuth;
    service = new UPSService(httpClient, upsAuth);

    vi.stubGlobal("crypto", { randomUUID: () => "uuid" });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should return normalized rate on success", async () => {
    (upsAuth.getToken as Mock).mockResolvedValue("token");
    const mockApiResponse = {
      RateResponse: {
        RatedShipment: [
          {
            GuaranteedDelivery: { BusinessDaysInTransit: "2", ScheduledDeliveryDate: "2023-10-27" },
            TotalCharges: { CurrencyCode: "USD", MonetaryValue: "100.00" },
          },
        ],
      },
    };
    (httpClient.post as Mock).mockResolvedValue({ data: mockApiResponse, status: 200 });

    const rateQuery = {
      destination: {},
      dimensions: {},
      packageWeight: {},
      shipper: {},
    } as unknown as RateQuery;

    const result = await service.getRate(rateQuery);

    expect(upsAuth.getToken).toHaveBeenCalled();
    expect(httpClient.post).toHaveBeenCalled();
    expect(result).toEqual({
      carrierName: "UPS",
      currencyCode: "USD",
      deliveryDays: "2",
      monetaryValue: "100.00",
      scheduledDeliveryDate: "2023-10-27",
    });
  });

  it("should throw error if auth fails", async () => {
    (upsAuth.getToken as Mock).mockResolvedValue(null);
    const rateQuery = {} as unknown as RateQuery;
    await expect(service.getRate(rateQuery)).rejects.toThrow("Failed to obtain UPS token");
  });

  it("should handle API errors (e.g. 400)", async () => {
    (upsAuth.getToken as Mock).mockResolvedValue("token");
    (httpClient.post as Mock).mockResolvedValue({
      data: { response: { errors: [{ message: "Bad Request" }] } },
      status: 400,
    });

    const rateQuery = {} as unknown as RateQuery;

    const errorData = { response: { errors: [{ message: "Error" }] } };
    (httpClient.post as Mock).mockResolvedValue({ data: errorData, status: 400 });

    const result = await service.getRate(rateQuery);
    expect(result).toEqual({ errors: ["Bad request while fetching UPS rate"], statusCode: 400 });
  });
});
