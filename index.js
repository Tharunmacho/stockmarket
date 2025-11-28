require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
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
  const question = req.body.question || "";
  console.log("Received question:", question);
  
  if (!question) {
    return res.status(400).json({ answer: "Question is required" });
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
