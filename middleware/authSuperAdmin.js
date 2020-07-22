module.exports = function(req, res, next) {
    if (!req.session.isSuperAdmin) {
       return res.redirect('/auth/login#login')
    }
    next()
}