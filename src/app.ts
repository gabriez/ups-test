import { routes } from "#routes/index.js";
import express, { Request, Response } from "express";
import morgan from "morgan";

const PORT = process.env.PORT ?? "3000";

const app = express();

app.use(morgan("common"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("port", PORT);

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

export default app;
