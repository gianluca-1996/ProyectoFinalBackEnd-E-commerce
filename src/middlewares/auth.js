const isAuthenticated = (req, res, next) => {
    if (req.session?.user) {
        return next();
    } else {
        res.redirect('/views/login');
    }
};

const isNotAuthenticated = (req, res, next) => {
    if (!req.session?.user) {
        return next();
    } else {
        res.redirect('/views/products');
    }
};

module.exports = {
    isAuthenticated,
    isNotAuthenticated
}