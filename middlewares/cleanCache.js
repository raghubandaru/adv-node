const { clearCache } = require("../services/cache");

module.exports = (req, res, next) => {
    await next();

    clearCache(req.user.id);
}