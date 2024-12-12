import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import xss from "xss-clean";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import ExpressMongoSanitize from "express-mongo-sanitize";
import connectDB from "./config/db.js";

import userRouter from "./routes/userRoutes.js";
import workspaceRouter from "./routes/workspaceRoutes.js";
import memberRouter from "./routes/memberRouter.js";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";

dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

const app = express();

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Allow requests from your frontend
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  }),
);

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies
app.use(cookieParser());

app.use("/api", limiter);
//!remove it
app.use("/", (req, res, next) => {
  console.log("new request made: ", req.method);
  next();
});

// Data sanitization against NoSQL query injection
app.use(ExpressMongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Routes
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/workspaces", workspaceRouter);
app.use("/api/v1/members", memberRouter);

// Unhandled routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
