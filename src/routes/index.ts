import { type Express, Router } from "express";

import ratingRouter from "./ratingRouter.js";

export const routes = (app: Express): Express => {
  const router = Router();
  return app.use("/api/v1.0", router.use("/rate", ratingRouter()));
};
