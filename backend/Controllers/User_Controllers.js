import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../Modals/User_Schema.js";
import { cloudinary } from "../Config/Cloudinary.js";
dotenv.config();


const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
};


export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;


        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required.",
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists.",
            });
        }


        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);


        let profilePic = "";
        let profilePicPublicId = "";
        if (req.file) {
            profilePic = req.file.path;
            profilePicPublicId = req.file.filename;
        }


        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profilePic,
            profilePicPublicId,
        });

        const token = generateToken(user);

        return res.status(201).json({
            success: true,
            message: "Account created successfully.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePic: user.profilePic,
                verified: user.verified,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again.",
        });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }


        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            message: "Logged in successfully.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePic: user.profilePic,
                verified: user.verified,
                bio: user.bio,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again.",
        });
    }
};


export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password -profilePicPublicId");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("Get profile error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again.",
        });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const { name, bio } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (name) user.name = name;
        if (bio !== undefined) user.bio = bio;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                profilePic: user.profilePic,
                verified: user.verified,
            },
        });
    } catch (error) {
        console.error("Update profile error:", error);
        return res.status(500).json({ success: false, message: "Server error." });
    }
};


export const updateProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image file uploaded. Please upload a valid image.",
            });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (user.profilePicPublicId) {
            await cloudinary.uploader.destroy(user.profilePicPublicId);
        }


        user.profilePic = req.file.path;
        user.profilePicPublicId = req.file.filename;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile picture updated successfully.",
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.error("Update profile picture error:", error);
        return res.status(500).json({ success: false, message: "Server error." });
    }
};


export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required.",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters.",
            });
        }

        const user = await User.findById(req.user.id).select("+password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect.",
            });
        }

        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully.",
        });
    } catch (error) {
        console.error("Change password error:", error);
        return res.status(500).json({ success: false, message: "Server error." });
    }
};



