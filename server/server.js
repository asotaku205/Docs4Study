import express from 'express';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import routerAuth from './routes/Auth.route.js';
import cookieParser from 'cookie-parser';
import routerUser from './routes/User.route.js';
//Tai bien moi truong
dotenv.config();

const app = express();

//Cong ket noi
const port = process.env.SERVER_PORT;


app.use(express.json());
app.use(cookieParser());

//Cac route
app.use("/api/auth",routerAuth);

app.use("api/user",routerUser);
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
