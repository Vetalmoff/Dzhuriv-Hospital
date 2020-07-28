module.exports = function(req, res, next) {
    if (req.session.isSuperAdmin || req.session.isAdmin || req.session.isModerator || req.session.isUser) {
        next()
    } else {
        return res.redirect('/auth/login#login')
    }
}