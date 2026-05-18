import http from "http";
import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import setupSocket from "./src/socket/index.js";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
setupSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});