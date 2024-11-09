import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import AuthRoutes from './routes/user/user_auth_routes';
import blogRouter from './routes/blogs/blog_routes';
import blogFetRouter from './routes/blogs/blog_fet_routes';
import userRoutes from './routes/user/user';
import cors from 'cors';
import client from "./db"
import { authMiddleware } from './middleware/auth_middelware';
import { v2 as cloudinary } from 'cloudinary';
import uploadRoutes from './routes/upload/upload_routes';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3010;

app.use(cors({
  origin: '*',
}));

app.options('*', cors({
  origin: '*',
}));



app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));



app.get("/", (req: Request, res: Response) => {
  res.json({
    msg: "healthy",
  });
});


app.use("/api/v1/upload", uploadRoutes)
app.use("/api/v1/auth", AuthRoutes)
app.use("/api/v1/user", authMiddleware, userRoutes)
app.use("/api/v1/blog", authMiddleware, blogFetRouter)
app.use("/api/v1/blog", authMiddleware, blogRouter)




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Defined routes:');
  app._router.stack.forEach((r: any) => {
    if (r.route && r.route.path) {
      console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
    }
  });
});
