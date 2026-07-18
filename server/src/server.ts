import "dotenv/config";
import app from "./app";
import { connectDB } from "./config/database";
import listEndpoints from "express-list-endpoints";

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Verity Server running on port ${PORT}`);
  });
};
console.log(listEndpoints(app));

startServer();