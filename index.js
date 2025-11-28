require("dotenv").config();
const express = require("express");
const axios = require("axios");
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
  // Accept question from body or query parameter
  const question = req.body.question || req.query.question || "";
  console.log("Received question from Zoho:", question);
  console.log("Request body:", req.body);
  console.log("Request query:", req.query);
  
  if (!question) {
    return res.status(400).json({ answer: "Question is required" });
  }
  
  try {
    console.log("Calling Hugging Face API...");
    
    // Create a focused prompt for stock market education
    const prompt = `You are a helpful stock market teacher for beginners. Answer this question clearly and educationally. Do not give personalized investment advice.\n\nQuestion: ${question}\n\nAnswer:`;
    
    const huggingfaceRes = await axios.post(
      "https://api-inference.huggingface.co/models/google/flan-t5-large",
      {
        inputs: prompt,
        parameters: {
          max_length: 200,
          temperature: 0.7
        }
      },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`
        },
        timeout: 30000
      }
    );

    let answer = huggingfaceRes.data[0]?.generated_text || "I'm sorry, I couldn't generate a response. Please try again.";
    
    console.log("Got response from Hugging Face:", answer);
    res.json({ answer });
  } catch (err) {
    console.error("ERROR:", err.message);
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
