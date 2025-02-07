const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/students/login');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.redirect('/students/login');
    }
};
