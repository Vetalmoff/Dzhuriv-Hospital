module.exports = function(req, res, next) {
    if (req.session.isSuperAdmin || req.session.isAdmin) {
        next()
    } else {
        return res.redirect('/auth/login#login')
    }
}