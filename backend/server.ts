import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import http from "http";

// Create an HTTP server
const server = http.createServer(app);

// Define PORT type properly
const PORT: number = parseInt(process.env.PORT || "5000", 10);

server.listen(PORT, () => {
  console.log(`Server is running on :${PORT}`);
});
