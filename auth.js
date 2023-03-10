const jwt = require("jsonwebtoken");
const redis = require('redis');
const { client } = require("./redis");

module.exports = (async (req, res, next) => {
    try {
        const token = req.header("token");
        if (!token) return res.status(403).send("Access denied.");
        const value = await client.get(`blacklist:${token}`);
        if(value) return res.status(401).send({message:"blacklisted token"});

        const decoded = jwt.verify(token, 'secret');
        req.userId = decoded.userId;

        next();
    } catch (error) {
        console.log(error);
        res.status(400).send("Invalid token");
    }
});