require("dotenv").config();
const http = require("http");

const server = http.createServer((req, res) => {
  console.log("Request received:", req.url);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: "OK" }));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log("Test server running on port", PORT);
});
