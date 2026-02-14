import type { FormattedErrors } from "#types/express.js";
import type { NormalizedRate, RateQuery } from "#types/ShippingRate.js";

import { CarrierService } from "#types/carrierService.js";

/**
 * Central structure to manage multiple carrier services. It allows adding, deleting, and retrieving carrier services by their unique IDs. It also provides a method to get shipping rates from a specific carrier service based on a given rate query.
 */
export class CarrierServicesStrategy {
  readonly services: Record<string, CarrierService | undefined>;

  constructor(services: [string, CarrierService][] = []) {
    this.services = {};
    for (const [id, service] of services) {
      this.services[id] = service;
    }
  }

  public addCarrierService(id: string, service: CarrierService): void {
    this.services[id] = service;
  }

  public deleteCarrierServiceById(carrierServiceId: string): void {
    this.services[carrierServiceId] = undefined;
  }

  public getCarrierServiceById(carrierServiceId: string): CarrierService | null {
    if (this.services[carrierServiceId] !== undefined) {
      return this.services[carrierServiceId];
    }

    return null;
  }

  public async getRate(carrierServiceId: string, rateQuery: RateQuery): Promise<FormattedErrors | NormalizedRate> {
    const service = this.getCarrierServiceById(carrierServiceId);
    if (!service) {
      throw new Error(`Carrier service with ID ${carrierServiceId} not found`);
    }
    const rateValue = await service.getRate(rateQuery);
    return rateValue;
  }
}

export const carrierService = new CarrierServicesStrategy();
