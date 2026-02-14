import app from "#app.js";
import { UPS_ACCOUNT_NUMBER, UPS_BASE_URL, UPS_PASSWORD, UPS_USERNAME } from "#constants.js";
import { carrierService } from "#libs/CarrierServices/CarrierServices.js";
import UPSService from "#libs/CarrierServices/UPSService.js";
import AxiosHttpClient from "#libs/HttpClient.js";
import { UpsAuth } from "#libs/UpsAuth.js";

try {
  const axiosHttpClient = new AxiosHttpClient(UPS_BASE_URL);

  const upsAuth = new UpsAuth(UPS_PASSWORD, UPS_USERNAME, UPS_ACCOUNT_NUMBER, axiosHttpClient);
  const upsService = new UPSService(axiosHttpClient, upsAuth);
  carrierService.addCarrierService("UPS", upsService);

  const PORT = app.get("port") as number;

  app.listen(PORT);
  console.log(`server listening on port ${PORT.toString()}. Access it at http://localhost:${PORT.toString()}`);
} catch (error) {
  console.log("Error during application initialization", error);
}
