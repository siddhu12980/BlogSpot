"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_auth_1 = require("../../controller/user/user_auth");
const AuthRoutes = express_1.default.Router();
AuthRoutes.post('/signup', user_auth_1.signup);
AuthRoutes.post('/signin', user_auth_1.signinController);
exports.default = AuthRoutes;
