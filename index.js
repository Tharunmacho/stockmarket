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
  // Accept question from body or query parameter
  const question = req.body.question || req.query.question || "";
  console.log("Received question from Zoho:", question);
  console.log("Request body:", req.body);
  console.log("Request query:", req.query);
  
  if (!question) {
    return res.status(400).json({ answer: "Question is required" });
  }
  
  try {
    console.log("Calling Hugging Face Inference API...");
    console.log("API Key:", HUGGINGFACE_API_KEY ? `${HUGGINGFACE_API_KEY.substring(0, 10)}...` : "MISSING");
    
    // Use free Inference API with Qwen model (reliable and fast)
    const huggingfaceRes = await axios.post(
      "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-Coder-32B-Instruct",
      {
        inputs: `You are a helpful stock market teacher for beginners. Answer this question clearly and educationally. Do not give personalized investment advice.\n\nQuestion: ${question}\n\nAnswer:`,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7,
          return_full_text: false
        }
      },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 30000
      }
    );

    console.log("HF status:", huggingfaceRes.status);
    console.log("HF data:", JSON.stringify(huggingfaceRes.data, null, 2));
    
    if (huggingfaceRes.status !== 200) {
      throw new Error(`HF error ${huggingfaceRes.status}: ${JSON.stringify(huggingfaceRes.data)}`);
    }
    
    const answer = huggingfaceRes.data[0]?.generated_text || "I'm sorry, I couldn't generate a response. Please try again.";
    
    console.log("Generated answer:", answer);
    res.json({ answer });
  } catch (err) {
    console.error("ERROR:", err.message);
    console.error("Response status:", err.response?.status);
    console.error("Response data:", JSON.stringify(err.response?.data, null, 2));
    console.error("Full error:", err);
    // Fallback response with the actual question context
    res.json({ answer: `Regarding "${question}": A stock represents ownership in a company. When you buy stock, you own a small piece of that company. Stock prices fluctuate based on company performance and market conditions. Investors buy stocks hoping their value will increase over time.` });
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
