
const userModel = require('./models/user')
module.exports = (async (req, res, next) => {
    try {
        var user_data = await userModel.findOne({where:{id:req.userId}});
        const user = req.user;
        if (user_data.role == 1) { // admin
          next();
        } else {
          return res.status(403).json({ message: "You are not authorized to access this resource." });
        }
    } catch (error) {
        return res.status(400).send(error);
    }
});