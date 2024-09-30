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


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*', 
}));

app.options('*', cors( {
  origin: '*',
} )); 

app.use(express.json());

const config = {
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET
}


app.get("/", (req: Request, res: Response) => {
  res.json({
    msg: "healthy",
  });
});


app.post("/upload", async (req: Request, res: Response) => {
  try {
    console.log('upload Body');

    const { file } = req.body;

    if (!file) {
      return res.status(400).json({ msg: "No file provided" });
    }

    console.log('Received File (Base64):');

    cloudinary.config(config);

    console.log("Cloudinary Configured");

    const uploadResult = await cloudinary.uploader.upload(file, {
      folder: 'uploads',
    });

    console.log("uploaded Result", uploadResult.secure_url);

    res.json({
      msg: "Image uploaded successfully",
      imageUrl: uploadResult.secure_url,
    });

  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Failed to upload image", error });
  }
});


app.use("/api/v1/auth", AuthRoutes)
app.use("/api/v1/user", authMiddleware, userRoutes)
app.use("/api/v1/blog", authMiddleware, blogFetRouter)
app.use("/api/v1/blog", authMiddleware, blogRouter)




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
