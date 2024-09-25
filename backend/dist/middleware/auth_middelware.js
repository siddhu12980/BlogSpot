"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    var _a;
    try {
        const bearer = req.headers.authorization;
        if (!bearer) {
            res.status(400).json({
                message: "No Auth Header",
            });
        }
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            return res
                .status(400)
                .json({ message: "Token not found" });
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        res.locals.user = decodedToken;
        next();
    }
    catch (error) {
        return res
            .status(401)
            .json({ err: "Provide a valid token" });
    }
};
exports.authMiddleware = authMiddleware;
