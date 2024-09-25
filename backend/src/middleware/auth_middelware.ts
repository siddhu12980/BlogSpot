import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

    const bearer = req.headers.authorization;

    if (!bearer) {
      res.status(400).json({
        message: "No Auth Header",
      });
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res
            .status(400)
            .json({ message: "Token not found" });
    }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
        res.locals.user = decodedToken;
        next();
    } catch (error) {
        return res
            .status(401)
            .json({ err: "Provide a valid token" });
    }
};