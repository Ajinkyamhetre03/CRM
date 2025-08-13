
// ===== src/middleware/roleCheck.js =====
export const checkRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Access denied. Insufficient permissions.'
            });
        }
        next();
    };
};

export const checkVerified = (req, res, next) => {
    if (req.user.role === 'farmer' && !req.user.isVerified) {
        return res.status(403).json({
            message: 'Account not verified. Please wait for admin approval.'
        });
    }
    next();
};

