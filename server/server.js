import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

/* ✅ Make Inngest PUBLIC */
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  })
);

/* ✅ Apply Clerk AFTER Inngest */
app.use(clerkMiddleware());

// Test Route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

export default app;