import { ratingController } from "#controllers/ratingController.js";
import { validateRating } from "#middleware/validateRating.js";
import { Router } from "express";

const ratingRouter = () => {
  const router = Router();

  router.post("/", validateRating, ratingController);

  return router;
};

export default ratingRouter;
