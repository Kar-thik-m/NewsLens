import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../Modals/User_Schema.js";

dotenv.config();

export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
        }

        const token = authHeader.split(" ")[1];

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            const message =
                err.name === "TokenExpiredError"
                    ? "Session expired. Please log in again."
                    : "Invalid token. Please log in again.";

            return res.status(401).json({ success: false, message });
        }

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User no longer exists. Please log in again.",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error during authentication.",
        });
    }
};

export const isVerified = (req, res, next) => {
    if (!req.user || !req.user.verified) {
        return res.status(403).json({
            success: false,
            message: "Account not verified. Please verify your email to access this resource.",
        });
    }
    next();
};