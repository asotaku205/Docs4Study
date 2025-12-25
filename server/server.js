import express from "express";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import adminDashboardRoutes from "./routes/CRUDadmindashboard.route.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.get("/api", (req, res) => {
  res.send("API is running");
});

app.use("/api/admin", adminDashboardRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
