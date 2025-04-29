import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import { Request, Response } from "express";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 3000;

// Basic Server Creation

// mongoDB Connection
const url = process.env.DATABASE_URL as string;
mongoose.connect(url);
const con = mongoose.connection;
con.on("error", console.error.bind(console, "MongoDB connection error:"));
con.once("open", () => {
  console.log("MongoDB Connected Successfully");
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    methods: "*",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req: Request, res: Response) => {
  console.log("GET request received at /");
  res.send("Hello Data!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
