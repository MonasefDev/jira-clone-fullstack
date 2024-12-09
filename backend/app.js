import express from "express";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import xss from "xss-clean";
import globalErrorHandler from "./controllers/errorController.js";

import authRoutes from './routes/authRoutes.js'

const app = express();

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Allow requests from your frontend
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend's origin
    methods: "GET,POST,PUT,DELETE", // Specify allowed HTTP methods
    credentials: true, // If you want to send cookies or authentication headers
  })
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


app.use("/api", limiter);
//!remove it
app.use('/',(req, res, next)=>{
  console.log('new request made: ' ,req.method);
  next();
})

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Serving static files
// app.use(express.static(`${__dirname}/public`));

// Routes
app.use("/api/v1/auth", authRoutes);

app.get("/api/v1", (req, res) => {
  res.send("Hello, World! from nodemon");
});

// Upload route
// app.use("/api", uploadRoute);

// Unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
// app.use(globalErrorHandler);

export default app;
