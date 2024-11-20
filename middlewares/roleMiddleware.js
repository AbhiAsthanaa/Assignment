const roleMiddleware = (roles) => (req, res, next) => {
    const userRole = req.user.roles;
    if (roles.some(role => userRole.includes(role))) {
        return next();
    }
    return res.status(403).json({ message: "Access denied. You do not have the required role." });
};

module.exports = roleMiddleware;
