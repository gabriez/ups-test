import { ResponseAPI } from "#types/express.js";
import { ReqRateValidation } from "#types/ShippingRate.js";
import { NextFunction } from "express";
import * as zod from "zod";

const validateNumericDimension = /^\d{1,6}\.\d{2}$/;

const ratingSchema = zod.object({
  destination: zod.object({
    AddressLine: zod.array(zod.string()).max(3, "AddressLine can have a maximum of 3 lines"),
    City: zod.string().optional(),
    CountryCode: zod.string().length(2, "CountryCode must be ISO-2 code"),
    PostalCode: zod.string().optional(),
    ResidentialAddressIndicator: zod.string().optional(),
    StateProvinceCode: zod.string().optional(),
  }),
  dimensions: zod.object({
    Height: zod
      .string()
      .refine(
        (value) => validateNumericDimension.test(value),
        "Height must be a numeric string with up to 6 digits and 2 decimal places (e.g., '123456.78')",
      ),
    Length: zod
      .string()
      .refine(
        (value) => validateNumericDimension.test(value),
        "Length must be a numeric string with up to 6 digits and 2 decimal places (e.g., '123456.78')",
      ),
    UnitOfMeasurement: zod.object({
      Code: zod.enum(["CM", "IN"], 'UnitOfMeasurement Code must be either "CM" or "IN"'),
      Description: zod.string(),
    }),
    Width: zod
      .string()
      .refine(
        (value) => validateNumericDimension.test(value),
        "Width must be a numeric string with up to 6 digits and 2 decimal places (e.g., '123456.78')",
      ),
  }),
  origin: zod
    .object({
      AddressLine: zod.array(zod.string()).max(3, "AddressLine can have a maximum of 3 lines").optional(),
      City: zod.string().optional(),
      CountryCode: zod.string().length(2, "CountryCode must be a ISO-2 code"),
      PostalCode: zod.string().optional(),
      StateProvinceCode: zod.string().optional(),
    })
    .optional(),
  packageWeight: zod.object({
    UnitOfMeasurement: zod.object({
      Code: zod.enum(["LBS", "KGS", "OZS"], 'UnitOfMeasurement Code must be either "LBS", "KGS", or "OZS"'),
      Description: zod.string(),
    }),
    Weight: zod
      .string()
      .refine(
        (value) => validateNumericDimension.test(value),
        "Weight must be a numeric string with up to 6 digits and 2 decimal places (e.g., '123456.78')",
      ),
  }),
  serviceLevel: zod
    .object({
      Code: zod.string().optional(),
    })
    .optional(),
  shipper: zod.object({
    AddressLine: zod.array(zod.string()).max(3, "AddressLine can have a maximum of 3 lines"),
    City: zod.string().optional(),
    CountryCode: zod.string().length(2, "CountryCode must be a ISO-2 code"),
    PostalCode: zod.string().optional(),
    StateProvinceCode: zod.string().optional(),
  }),
});

export const validateRating = (req: ReqRateValidation, res: ResponseAPI, next: NextFunction) => {
  const resErr = res.status(422);
  if (!req.body) {
    resErr.json({
      message: "Missing data in request body",
      status: false,
    });
    return;
  }

  try {
    const validationResult = ratingSchema.safeParse(req.body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => err.message);
      resErr.json({
        errors,
        message: "Validation failed for request body",
        status: false,
      });
      return;
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
    return;
  }
};
