require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
// Add both parsers for maximum compatibility
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
  
  // Generate educational stock market answer
  console.log("Generating answer for:", question);
  
  const lowerQuestion = question.toLowerCase();
  let answer = "";
  
  // Provide educational answers based on keywords
  if (lowerQuestion.includes("dividend")) {
    answer = "A dividend is a payment made by a corporation to its shareholders, usually as a distribution of profits. When a company earns a profit and decides to share it with investors, it pays dividends. Companies typically pay dividends quarterly, and the amount is decided by the board of directors. Dividend-paying stocks can provide regular income for investors.";
  } else if (lowerQuestion.includes("stock") && (lowerQuestion.includes("what") || lowerQuestion.includes("define"))) {
    answer = "A stock represents ownership in a company. When you buy a stock, you become a partial owner (shareholder) of that company. Stocks are traded on stock exchanges like NYSE or NASDAQ. The price of a stock fluctuates based on the company's performance, market conditions, and investor sentiment. Investors buy stocks hoping their value will increase over time.";
  } else if (lowerQuestion.includes("bull market")) {
    answer = "A bull market is a period when stock prices are rising or expected to rise. It's characterized by investor optimism, economic growth, and increased buying activity. The term 'bull' comes from the way a bull attacks - by thrusting its horns upward, symbolizing rising prices. Bull markets can last for months or even years.";
  } else if (lowerQuestion.includes("bear market")) {
    answer = "A bear market is a period when stock prices are falling or expected to fall, typically by 20% or more from recent highs. It's characterized by investor pessimism and selling activity. The term 'bear' comes from the way a bear attacks - by swiping downward, symbolizing falling prices. Bear markets often occur during economic recessions.";
  } else if (lowerQuestion.includes("portfolio") || lowerQuestion.includes("diversif")) {
    answer = "Portfolio diversification means spreading your investments across different assets (stocks, bonds, real estate, etc.) to reduce risk. The principle is 'don't put all your eggs in one basket.' A diversified portfolio can help protect you from significant losses if one investment performs poorly, as gains in other areas may offset those losses.";
  } else if (lowerQuestion.includes("p/e ratio") || lowerQuestion.includes("price to earning")) {
    answer = "The P/E ratio (Price-to-Earnings ratio) is a valuation metric that compares a company's stock price to its earnings per share (EPS). It's calculated as: Stock Price ÷ Earnings Per Share. A high P/E might indicate the stock is overvalued or that investors expect high growth. A low P/E might suggest it's undervalued or facing challenges. It's used to compare companies in the same industry.";
  } else if (lowerQuestion.includes("ipo") || lowerQuestion.includes("initial public offering")) {
    answer = "An IPO (Initial Public Offering) is when a private company first sells its shares to the public, becoming a publicly traded company. This allows the company to raise capital from public investors. Before an IPO, the company is owned by founders, early investors, and venture capitalists. After the IPO, anyone can buy shares on the stock exchange.";
  } else if (lowerQuestion.includes("mutual fund")) {
    answer = "A mutual fund is an investment vehicle that pools money from many investors to purchase a diversified portfolio of stocks, bonds, or other securities. Professional fund managers make investment decisions on behalf of investors. Mutual funds offer instant diversification and professional management, making them popular for beginner investors. You buy 'units' or 'shares' of the fund.";
  } else if (lowerQuestion.includes("etf") || lowerQuestion.includes("exchange traded")) {
    answer = "An ETF (Exchange-Traded Fund) is similar to a mutual fund but trades on stock exchanges like individual stocks. ETFs typically track an index (like S&P 500), sector, commodity, or asset class. They offer diversification, lower fees than mutual funds, and can be bought/sold throughout the trading day at market prices. They're popular for passive investing strategies.";
  } else if (lowerQuestion.includes("blue chip")) {
    answer = "Blue chip stocks are shares of large, well-established, and financially stable companies with a history of reliable performance. The term comes from poker, where blue chips have the highest value. Examples include companies like Microsoft, Apple, or Coca-Cola. These stocks are generally considered safer investments with lower volatility, though they may offer slower growth than smaller companies.";
  } else {
    answer = `Regarding "${question}": In stock markets, it's important to understand basic concepts before investing. A stock represents ownership in a company, and stock prices fluctuate based on company performance, economic conditions, and investor sentiment. Always research thoroughly, diversify your portfolio, and consider consulting with a financial advisor for personalized advice. Remember, past performance doesn't guarantee future results.`;
  }
  
  console.log("Sending answer:", answer.substring(0, 100) + "...");
  res.json({ answer });
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
