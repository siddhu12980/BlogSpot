import express from 'express';
import { followRelationController, followUserController, getAuthorWithPostsController, getProfileListController, getUserDetailsController, updateAboutController } from '../../controller/user/user';

const userRoutes = express.Router();

userRoutes.get("/author/:id", getAuthorWithPostsController);
userRoutes.get("/name",getUserDetailsController)
userRoutes.put("/follow/:id",followUserController)
userRoutes.get("/relation",followRelationController)
userRoutes.post("/about",updateAboutController)
userRoutes.get("/profilelist/:id",getProfileListController)

export default userRoutes;