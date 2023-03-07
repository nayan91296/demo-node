const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.header("token");
        if (!token) return res.status(403).send("Access denied.");
        const decoded = jwt.verify(token,'secret');
        req.userId = decoded.userId;
        next();
    } catch (error) {
      console.log(error);
        res.status(400).send("Invalid token");
    }
};