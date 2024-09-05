
export const verifyUser = async (req, res, next) => {
    const token = req.session || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    if (token?.user?.status === "active") {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: "You're not authorized to this page, just admin can!",
        });
    }
};

export const verifyAdmin = async (req, res, next) => {
    const token = req.session || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    console.log("🚀 ~ verifyAdmin ~ token:", token)
    if (token?.user?.role === "admin" && token?.user?.status === "active") {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: "You're not authorized to this page, just admin can!",
        });
    }
};
