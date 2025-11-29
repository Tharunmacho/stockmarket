require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
// Add both parsers for maximum compatibility
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

if (!HUGGINGFACE_API_KEY) {
  console.error("ERROR: HUGGINGFACE_API_KEY environment variable is not set!");
  process.exit(1);
}

console.log(`Hugging Face API Key loaded: ${HUGGINGFACE_API_KEY.substring(0, 20)}...`);

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Stock assistant is running" });
});

app.post("/stock-assistant", async (req, res) => {
  console.log("=== NEW REQUEST ===");
  console.log("Request headers:", JSON.stringify(req.headers, null, 2));
  console.log("Request body:", JSON.stringify(req.body, null, 2));
  console.log("Request query:", JSON.stringify(req.query, null, 2));
  console.log("Content-Type:", req.get("Content-Type"));
  
  // Accept question from body, query, or headers (Zoho sometimes sends in headers)
  const question = req.body.question || req.query.question || req.headers.question || "";
  console.log("Extracted question:", question);
  
  if (!question) {
    console.log("ERROR: No question provided");
    return res.status(400).json({ answer: "Question is required", debug: { body: req.body, query: req.query } });
  }
  
  try {
    // For now, return a mock response to test the server
    const mockAnswer = `A stock is a share of ownership in a company. When you buy a stock, you own a small piece of that company. Stock prices go up and down based on how well the company is doing and what people think it's worth. Investors buy stocks hoping the price will go up so they can make money.`;
    
    res.json({ answer: mockAnswer });
  } catch (err) {
    console.error("ERROR:", err.message);
    res.status(500).json({ answer: "Error: " + err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Stock assistant running on port", PORT));

// Global error handlers
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION at:", promise, "reason:", reason);
});
