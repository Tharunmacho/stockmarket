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
  
  // Accept question from body or query parameter
  const question = req.body.question || req.query.question || "";
  console.log("Extracted question:", question);
  
  if (!question) {
    console.log("ERROR: No question provided");
    return res.status(400).json({ answer: "Question is required", debug: { body: req.body, query: req.query } });
  }
  
  // Temporary test response to verify connection
  console.log("Sending test response with question:", question);
  return res.json({ 
    answer: `Test successful! You asked: "${question}"`,
    gotQuestion: question,
    timestamp: new Date().toISOString()
  });
  // Temporary test response to verify connection
  console.log("Sending test response with question:", question);
  return res.json({ 
    answer: `Test successful! You asked: "${question}"`,
    gotQuestion: question,
    timestamp: new Date().toISOString()
  });
  
  /* COMMENTED OUT FOR TESTING - RE-ENABLE AFTER ZOHO CONNECTION WORKS
  try {
    console.log("Calling Hugging Face Router API...");
    console.log("Question:", question);
    
    // Use HF Router with chat completions endpoint
    const huggingfaceRes = await axios.post(
      "https://router.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct/v1/chat/completions",
      {
        model: "meta-llama/Llama-3.2-3B-Instruct",
        messages: [
          { 
            role: "system", 
            content: "You are a helpful stock market teacher for beginners. Answer questions clearly and educationally. Do not give personalized investment advice."
          },
          { 
            role: "user", 
            content: question
          }
        ],
        max_tokens: 200,
        temperature: 0.7
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
    
    const answer = huggingfaceRes.data.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";
    
    console.log("Generated answer:", answer);
    res.json({ answer });
  } catch (err) {
    console.error("ERROR:", err.message);
    console.error("Response status:", err.response?.status);
    console.error("Response data:", JSON.stringify(err.response?.data, null, 2));
    
    // Fallback response with the actual question context
    res.json({ answer: `Regarding "${question}": A stock represents ownership in a company. When you buy stock, you own a small piece of that company. Stock prices fluctuate based on company performance and market conditions. Investors buy stocks hoping their value will increase over time.` });
  }
  */
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
