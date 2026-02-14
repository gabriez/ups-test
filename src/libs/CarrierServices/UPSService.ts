import type { CarrierService } from "#types/carrierService.js";
import type { FormattedErrors } from "#types/express.js";
import type { NormalizedRate, RateQuery, RateResponseAPI } from "#types/ShippingRate.js";

import { HttpClient } from "#types/httpClient.js";
import { isUpsResponseError, type UpsResponseErrors } from "#types/UpsTypes.js";

import { UpsAuth } from "../UpsAuth.js";

export default class UPSService implements CarrierService {
  readonly description: string;
  readonly name: string;
  private httpClient: HttpClient;
  private requestOption: string;
  private upsAuth: UpsAuth;
  private version: string;

  constructor(
    httpClient: HttpClient,
    upsAuth: UpsAuth,
    version = "v2409",
    requestOption = "Rate",
    name = "UPS",
    description = "Worldwide shipping solutions",
  ) {
    this.httpClient = httpClient;
    this.upsAuth = upsAuth;
    this.version = version;
    this.requestOption = requestOption;
    this.name = name;
    this.description = description;
  }

  async getRate({ destination, dimensions, origin, packageWeight, serviceLevel, shipper }: RateQuery): Promise<FormattedErrors | NormalizedRate> {
    let token;
    try {
      token = await this.upsAuth.getToken();
    } catch (err) {
      console.log("Error fetching UPS token:", err);
      throw new Error(`Error fetching UPS token`);
    }

    if (!token) {
      throw new Error("Failed to obtain UPS token");
    }

    const { data, status } = await this.httpClient.post<RateResponseAPI | UpsResponseErrors>(
      `/api/rating/${this.version}/${this.requestOption}`,
      {
        RateQuest: {
          Request: {
            SubVersion: "2409",
            TransactionReference: {
              CustomerContext: crypto.randomUUID(),
            },
          },
          Shipment: {
            Package: [
              {
                Dimensions: dimensions,
                PackageWeight: packageWeight,
              },
            ],
            Shipper: {
              Address: shipper,
            },

            ShipTo: {
              Address: destination,
            },
            ...(origin
              ? {
                  ShipFrom: {
                    Address: origin,
                  },
                }
              : {}),
            ...(serviceLevel ? { Service: serviceLevel } : {}),
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          transactionSrc: "testing",
          transId: crypto.randomUUID().slice(0, 32),
        },
      },
    );

    if (isUpsResponseError(data)) {
      if (status === 400) {
        console.log("Bad request while fetching UPS rate:", data);
        return { errors: ["Bad request while fetching UPS rate"], statusCode: 400 };
      }

      if (status === 401) {
        console.log("Unauthorized while fetching UPS rate:", data);
        throw new Error("Unauthorized while fetching UPS rate");
      }

      if (status === 429) {
        console.log("Too many requests while fetching UPS rate:", data);
        console.log("Consider implementing retry logic with exponential backoff to handle rate limits.");
        return { errors: ["Too many requests while fetching UPS rate"], statusCode: 429 };
      }
      if (status === 403) {
        console.log("Forbidden while fetching UPS rate:", data);
        throw new Error("Forbidden while fetching UPS rate");
      }
      throw new Error(`Error fetching UPS rate: ${data.response.errors.map((err) => err.message).join(", ")}`);
    }

    if (status !== 200) {
      console.log(`Unexpected status code ${status.toString()} while fetching UPS rate:`, data);
      return { errors: [`Unexpected status code ${status.toString()} while fetching UPS rate`], statusCode: status };
    }

    if (data.RateResponse.RatedShipment.length === 0) {
      return { errors: ["No rated shipments found in UPS response"], statusCode: 404 };
    }

    return {
      carrierName: this.name,
      currencyCode: data.RateResponse.RatedShipment[0].TotalCharges.CurrencyCode,
      deliveryDays: data.RateResponse.RatedShipment[0].GuaranteedDelivery.BusinessDaysInTransit,
      monetaryValue: data.RateResponse.RatedShipment[0].TotalCharges.MonetaryValue,
      scheduledDeliveryDate: data.RateResponse.RatedShipment[0].GuaranteedDelivery.ScheduledDeliveryDate,
    };
  }
}
