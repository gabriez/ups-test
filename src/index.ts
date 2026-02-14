import { PORT, UPS_ACCOUNT_NUMBER, UPS_BASE_URL, UPS_PASSWORD, UPS_USERNAME } from "#constants.js";
import { carrierService } from "#libs/CarrierServices/CarrierServices.js";
import UPSService from "#libs/CarrierServices/UPSService.js";
import AxiosHttpClient from "#libs/HttpClient.js";
import { UpsAuth } from "#libs/UpsAuth.js";
import { routes } from "#routes/index.js";
import express, { Request, Response } from "express";
import morgan from "morgan";

const axiosHttpClient = new AxiosHttpClient(UPS_BASE_URL);
const upsAuth = new UpsAuth(UPS_PASSWORD, UPS_USERNAME, UPS_ACCOUNT_NUMBER, axiosHttpClient);
const upsService = new UPSService(axiosHttpClient, upsAuth);
carrierService.addCarrierService("UPS", upsService);

const app = express();

app.use(morgan("common"));

routes(app);

app.all("/", (_req: Request, res: Response) => {
  res.json({
    message: "Welcome to the Shipping Rate API!",
    status: true,
  });
});

app.all("/status", (_req: Request, res: Response) => {
  res.json({
    message: "Active and running server!",
    status: true,
  });
});

app.all("/*rest", (_req: Request, res: Response) => {
  res.status(404).json({
    error: "404 - requested resource not found",
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
