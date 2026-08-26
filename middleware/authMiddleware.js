const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to verify JWT token and attach user to request
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const secret = process.env.JWT_SECRET || "dfs_super_secret_jwt_key_2026_secure";
      const decoded = jwt.verify(token, secret);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found or account deactivated" });
      }

      next();
    } catch (error) {
      console.error("JWT Verification Error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed or expired" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

// Optional auth middleware (attaches user if valid token exists, but doesn't block if missing)
const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const secret = process.env.JWT_SECRET || "dfs_super_secret_jwt_key_2026_secure";
      const decoded = jwt.verify(token, secret);
      req.user = await User.findById(decoded.id).select("-password");
    } catch (error) {
      // Ignore token failure for optional auth
    }
  }
  next();
};

module.exports = { protect, optionalAuth };
