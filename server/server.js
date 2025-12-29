import express from 'express';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import routerAuth from './routes/Auth.route.js';
import cookieParser from 'cookie-parser';
import routerUser from './routes/User.route.js';
import adminDashboardRoutes from './routes/CRUDadmindashboard.route.js';

//Tai bien moi truong
dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(cookieParser());

//Cac route
app.use("/api/auth", routerAuth);
app.use("/api/user", routerUser);
app.use("/api/admin", adminDashboardRoutes);

const runServer = async () => {
    try {
        //Ket noi toi database
        await connectDB();
        //Mo cong ket noi toi server
        app.listen(port, () => {

            console.log(`Start running server on port ${port}`);

        })
    } catch (error) {
        console.log("Failed to start server", error);
    }
}
runServer();
