import { verifyEnvVariable } from "#utils/verifyEnvVariable.js";

export const PORT = process.env.PORT ?? "3000";
export const UPS_PASSWORD = verifyEnvVariable("UPS_PASSWORD");
export const UPS_USERNAME = verifyEnvVariable("UPS_USERNAME");
export const UPS_ACCOUNT_NUMBER = verifyEnvVariable("UPS_ACCOUNT_NUMBER");
export const UPS_BASE_URL = verifyEnvVariable("UPS_BASE_URL");
