import User from "../models/user.js";

export const verifyToken = async (req, res, next) => {
    const token = req.cookies.sessionToken || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access token not found. You're not authorized",
        });
    }

    try {
        const session = await Session.findOne({ token });

        if (!session) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token. You're not authorized",
            });
        }

        const userObject = await User.findById(session.userId);

        if (!userObject) {
            return res.status(401).json({
                success: false,
                message: "User not found. You're not authorized",
            });
        }

        req.user = userObject;
        req.session = session;
        next();
    } catch (err) {
        console.error("Token verification error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error during token verification",
        });
    }
};

export const verifyAdmin = async (req, res, next) => {
    await verifyToken(req, res, async () => {
        if (req.user && req.user.role === "admin" && req.user.status === "active") {
            next();
        } else {
            return res.status(403).json({
                success: false,
                message: "You're not authorized to this page, just admin can!",
            });
        }
    });
};
