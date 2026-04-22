import 'dotenv/config'; // ← MUST be the very first import
import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
app.use("/api/inngest", serve({ client: inngest, functions }));
// Route
app.get('/', (req, res) => {
  res.send('server is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});