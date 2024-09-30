import express from 'express';
import { test, uploder } from '../../controller/upload/upload';

const uploadRoutes = express.Router();


uploadRoutes.post("/", uploder);
uploadRoutes.post("/test", test);

export default uploadRoutes;