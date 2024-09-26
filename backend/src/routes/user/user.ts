import express from 'express';
import { deleteSavedPostController, followRelationController, followUserController, getAuthorWithPostsController, getProfileListController, getUserDetailsController, updateAboutController, uploadBannerController, uploadProfilePicController } from '../../controller/user/user';

const userRoutes = express.Router();

userRoutes.delete("/savedpost/:id", deleteSavedPostController);
userRoutes.post("/profile", uploadProfilePicController);
userRoutes.post("/banner", uploadBannerController);
userRoutes.get("/author/:id", getAuthorWithPostsController);
userRoutes.get("/name", getUserDetailsController)
userRoutes.put("/follow/:id", followUserController)
userRoutes.get("/relation", followRelationController)
userRoutes.post("/about", updateAboutController)
userRoutes.get("/profilelist/:id", getProfileListController)

export default userRoutes;