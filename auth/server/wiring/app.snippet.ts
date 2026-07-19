import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import { authRouter } from "./routes/auth.routes.js";

const clientOrigin = process.env["CLIENT_ORIGIN"] ?? "http://localhost:5173";

export const app = express();

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use("/auth", authRouter);

// Mount your other routers here...

app.use(notFoundHandler);
app.use(errorHandler);
