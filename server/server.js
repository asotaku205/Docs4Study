import express from 'express';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import routerAuth from './routes/Auth.route.js';
import cookieParser from 'cookie-parser';
import routerUser from './routes/User.route.js';
import usersRoutes from './routes/Users.route.js';
import coursesRoutes from './routes/Courses.route.js';
import documentsRoutes from './routes/Documents.route.js';
import ordersRoutes from './routes/Orders.route.js';
import blogPostsRoutes from './routes/BlogPosts.route.js';

//Tai bien moi truong
dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// CORS middleware
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost', 'http://localhost:80', 'http://localhost:5173'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  
  res.header("Access-Control-Allow-Credentials", "true");
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
app.use("/api/admin/users", usersRoutes);
app.use("/api/admin/courses", coursesRoutes);
app.use("/api/admin/documents", documentsRoutes);
app.use("/api/admin/orders", ordersRoutes);
app.use("/api/admin/blog-posts", blogPostsRoutes);

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
