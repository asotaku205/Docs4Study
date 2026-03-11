import express from 'express';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import routerAuth from './routes/Auth.route.js';
import cookieParser from 'cookie-parser';
import routerUser from './routes/User.route.js';
import adminDashboardRoutes from './routes/CRUDadmindashboard.route.js';
import uploadRoutes from './routes/Upload.route.js';
import { seedCategories } from './config/seedCategories.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Middleware CORS - xử lý chia sẻ tài nguyên giữa các nguồn gốc khác nhau
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost',
    'http://localhost:80',
    'http://localhost:5173'
  ];
  
  if (origin && (allowedOrigins.includes(origin) || origin.includes('.app.github.dev'))) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Tăng giới hạn kích thước payload cho bài viết blog có chứa ảnh
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Tạo thư mục uploads nếu chưa tồn tại
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Phục vụ file tĩnh từ thư mục uploads
app.use('/uploads', express.static(uploadsDir));

//Cac route
app.use("/api/auth", routerAuth);
app.use("/api/user", routerUser);
app.use("/api/admin", adminDashboardRoutes);
app.use("/api/upload", uploadRoutes);

const runServer = async () => {
    try {
        await connectDB();
        await seedCategories();
        app.listen(port, () => {
            console.log(`Start running server on port ${port}`);
        })
    } catch (error) {
        console.log("Failed to start server", error);
    }
}
runServer();
