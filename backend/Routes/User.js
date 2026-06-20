import express from "express";
import { upload } from "../Config/Cloudinary.js";
import { protect } from "../Middleware/Authentications.js";
import {
    register,
    login,
    getProfile,
    updateProfile,
    updateProfilePicture,
    changePassword,

} from "../Controllers/User_Controllers.js";

const router = express.Router();



router.post("/register", upload.single("profilePic"), register);


router.post("/login", login);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put("/profile/picture", upload.single("profilePic"), updateProfilePicture);
router.put("/change-password", changePassword);


export default router;
