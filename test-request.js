const http = require("http");

const options = {
  hostname: "localhost",
  port: 4000,
  path: "/stock-assistant",
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  let data = "";
  res.on("data", chunk => data += chunk);
  res.on("end", () => {
    console.log("Response:", data);
  });
});

req.on("error", (error) => {
  console.error("Error:", error.message);
});

const body = JSON.stringify({ question: "What is a stock?" });
req.write(body);
req.end();
