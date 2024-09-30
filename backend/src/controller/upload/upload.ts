import { Request, Response } from 'express';

import { v2 as cloudinary } from 'cloudinary';

const config = {
    cloud_name: "dq3oizrkk",
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET
}


export const uploder = async (req: Request, res: Response) => {
    try {
        console.log('upload Body');

        const { file } = req.body;

        if (!file) {
            return res.status(400).json({ msg: "No file provided" });
        }

        console.log('Received File (Base64):');

        await cloudinary.config(config);

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
        res.status(500).json({ message: "Failed to upload image Backend", error });
    }
}

export const test = async (req: Request, res: Response) => {
    console.log("Test upload route hit");
    console.log("Request body:", req.body);
    res.json({ message: "Test upload route working" });
}
