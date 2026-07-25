import dotenv from "dotenv";
dotenv.config();

import http from "http";

import app from "./src/app.js";

import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 4001;

const server = http.createServer(app);

await connectDB();

server.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});