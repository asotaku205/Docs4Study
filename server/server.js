import express from 'express';
import {connectDB} from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();
connectDB();
const app = express();
app.listen(5001, () => {
    console.log('Server đang chạy trên cổng 5001');
});
app.get("/api", (req, res) => {
    res.send("API hoạt động, đẳng cấp ");
});