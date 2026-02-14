/* eslint-disable perfectionist/sort-enums, perfectionist/sort-modules, perfectionist/sort-interfaces */

import type { MakeOptional } from "#types/utils.js";

import { RequestValidatedAPI, RequestValidationAPI, ResponseAPI } from "./express.js";

export enum UnitOfMeasurementEnumDimensions {
  CM = "CM",
  IN = "IN",
}
export enum UnitOfMeasurementEnumWeight {
  LBS = "LBS",
  KGS = "KGS",
  OZS = "OZS",
}

export interface Addresses {
  AddressLine: string[];
  City?: string;
  CountryCode: string;
  PostalCode?: string;
  StateProvinceCode?: string;
}

export interface DestinationInterface extends Addresses {
  ResidentialAddressIndicator?: string;
}

export interface UnitOfMeasurement<T> {
  Code: T;
  Description: string;
}

export type OriginInterface = MakeOptional<Addresses, "AddressLine">;
export interface PackageDimensions {
  Height: string;
  Length: string;
  UnitOfMeasurement: UnitOfMeasurement<UnitOfMeasurementEnumDimensions>;
  Width: string;
}

export interface PackageWeight {
  UnitOfMeasurement: UnitOfMeasurement<UnitOfMeasurementEnumWeight>;
  Weight: string;
}

export interface RateQuery {
  destination: DestinationInterface;
  dimensions: PackageDimensions;
  origin?: OriginInterface;
  serviceLevel?: {
    Code?: string;
  };
  shipper: Addresses;
  packageWeight: PackageWeight;
}

export type ReqRateValidated = RequestValidatedAPI<RateQuery>;

export type ReqRateValidation = RequestValidationAPI<RateQuery>;

export interface NormalizedRate {
  currencyCode: string;
  monetaryValue: string;
  carrierName: string;
  deliveryDays: string;
  scheduledDeliveryDate: string;
}

export function isNormalizedRate(rate: unknown): rate is NormalizedRate {
  return typeof rate === "object" && rate !== null && "carrierName" in rate;
}

export type ResRate = ResponseAPI<NormalizedRate>;

export interface RateResponseAPI {
  RateResponse: RateResponse;
}

export interface RateResponse {
  Response?: ResponseInfo;
  RatedShipment: RatedShipment[];
}

export interface RatedShipment {
  Disclaimer?: ResponseStatus[];
  Service?: ResponseStatus;
  RateChart?: string;
  Zone?: string;
  RatedShipmentAlert?: ResponseStatus[];
  BillableWeightCalculationMethod?: string;
  RatingMethod?: string;
  BillingWeight?: BillingWeight;
  TransportationCharges?: BaseServiceCharge;
  BaseServiceCharge?: BaseServiceCharge;
  ItemizedCharges?: ItemizedCharge[];
  FRSShipmentData?: FRSShipmentData;
  ServiceOptionsCharges?: BaseServiceCharge;
  TaxCharges?: TaxCharge[];
  TotalCharges: BaseServiceCharge;
  TotalChargesWithTaxes?: BaseServiceCharge;
  NegotiatedRateCharges?: NegotiatedRateCharges;
  RatedPackage?: RatedPackage[];
  TimeInTransit?: TimeInTransit;
  GuaranteedDelivery: GuaranteedDelivery;
  RoarRatedIndicator?: string;
}

export interface BaseServiceCharge {
  CurrencyCode: string;
  MonetaryValue: string;
}

export interface BillingWeight {
  UnitOfMeasurement: ResponseStatus;
  Weight: string;
}

export interface ResponseStatus {
  Code: string;
  Description: string;
}

export interface FRSShipmentData {
  TransportationCharges: TransportationCharges;
  FreightDensityRate: FreightDensityRate;
  HandlingUnits: HandlingUnit[];
}

export interface FreightDensityRate {
  Density: string;
  TotalCubicFeet: string;
}

export interface HandlingUnit {
  Quantity: string;
  Type: ResponseStatus;
  Dimensions: Dimensions;
  AdjustedHeight: AdjustedHeight;
}

export interface AdjustedHeight {
  Value: string;
  UnitOfMeasurement: string;
}

export interface Dimensions {
  UnitOfMeasurement: ResponseStatus;
  Length: string;
  Width: string;
  Height: string;
}

export interface TransportationCharges {
  GrossCharge: BaseServiceCharge;
  DiscountAmount: BaseServiceCharge;
  DiscountPercentage: string;
  NetCharge: BaseServiceCharge;
}

export interface GuaranteedDelivery {
  BusinessDaysInTransit: string;
  DeliveryByTime: string;
  ScheduledDeliveryDate: string;
}

export interface ItemizedCharge {
  Code: string;
  Description: string;
  CurrencyCode: string;
  MonetaryValue: string;
  SubType: string;
}

export interface NegotiatedRateCharges {
  BaseServiceCharge: BaseServiceCharge[];
  RateModifier: RateModifier[];
  ItemizedCharges: ItemizedCharge[];
  TaxCharges: TaxCharge[];
  TotalCharge: BaseServiceCharge;
  TotalChargesWithTaxes: BaseServiceCharge;
}

export interface RateModifier {
  ModifierType: string;
  ModifierDesc: string;
  Amount: string;
}

export interface TaxCharge {
  Type: string;
  MonetaryValue: string;
}

export interface RatedPackage {
  BaseServiceCharge: BaseServiceCharge;
  TransportationCharges: BaseServiceCharge;
  ServiceOptionsCharges: BaseServiceCharge;
  TotalCharges: BaseServiceCharge;
  Weight: string;
  BillingWeight: BillingWeight;
  Accessorial: ResponseStatus[];
  ItemizedCharges: ItemizedCharge[];
  NegotiatedCharges: NegotiatedCharges;
  SimpleRate: SimpleRate;
  RateModifier: RateModifier[];
}

export interface NegotiatedCharges {
  RateModifier: RateModifier[];
  ItemizedCharges: ItemizedCharge[];
}

export interface SimpleRate {
  Code: string;
}

export interface TimeInTransit {
  PickupDate: string;
  DocumentsOnlyIndicator: string;
  PackageBillType: string;
  ServiceSummary: ServiceSummary;
  AutoDutyCode: string;
  Disclaimer: string;
}

export interface ServiceSummary {
  Service: Service;
  GuaranteedIndicator: string;
  Disclaimer: string;
  EstimatedArrival: EstimatedArrival;
  SaturdayDelivery: string;
  SaturdayDeliveryDisclaimer: string;
  SundayDelivery: string;
  SundayDeliveryDisclaimer: string;
}

export interface EstimatedArrival {
  Arrival: Arrival;
  BusinessDaysInTransit: string;
  Pickup: Arrival;
  DayOfWeek: string;
  CustomerCenterCutoff: string;
  DelayCount: string;
  HolidayCount: string;
  RestDays: string;
  TotalTransitDays: string;
}

export interface Arrival {
  Date: string;
  Time: string;
}

export interface Service {
  Description: string;
}

export interface ResponseInfo {
  ResponseStatus: ResponseStatus;
  Alert: ResponseStatus[];
  AlertDetail: AlertDetail[];
  TransactionReference: TransactionReference;
}

export interface AlertDetail {
  Code: string;
  Description: string;
  ElementLevelInformation: ElementLevelInformation;
}

export interface ElementLevelInformation {
  Level: string;
  ElementIdentifier: ElementIdentifier[];
}

export interface ElementIdentifier {
  Code: null;
  Value: null;
}

export interface TransactionReference {
  CustomerContext: string;
}
