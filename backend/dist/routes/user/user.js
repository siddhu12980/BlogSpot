"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../../controller/user/user");
const userRoutes = express_1.default.Router();
userRoutes.get("/author/:id", user_1.getAuthorWithPostsController);
userRoutes.get("/name", user_1.getUserDetailsController);
userRoutes.put("/follow/:id", user_1.followUserController);
userRoutes.get("/relation", user_1.followRelationController);
userRoutes.post("/about", user_1.updateAboutController);
userRoutes.get("/profilelist/:id", user_1.getProfileListController);
exports.default = userRoutes;
