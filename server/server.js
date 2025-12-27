import express from 'express';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import routerAuth from './routes/Auth.route.js';
import cookieParser from 'cookie-parser';
import routerUser from './routes/User.route.js';
import cors from 'cors';
//Tai bien moi truong
dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

//Cac route
app.use("/api/auth",routerAuth);


app.use("/api/user",routerUser);

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
