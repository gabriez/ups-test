import { FormattedErrors } from "./express.js";
import { NormalizedRate, RateQuery } from "./ShippingRate.js";

export interface CarrierService {
  description: string;
  getRate({ destination, dimensions, origin, serviceLevel, shipper }: RateQuery): Promise<FormattedErrors | NormalizedRate>;
  name: string;
}
