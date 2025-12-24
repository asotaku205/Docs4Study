import express from 'express';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import routerAuth from './routes/Auth.route.js';
//Tai bien moi truong
dotenv.config();

const app = express();

//Cong ket noi
const port = process.env.SERVER_PORT;


app.use(express.json());

//Cac route
app.use("/api/auth",routerAuth);

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
