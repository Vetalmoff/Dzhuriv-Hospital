module.exports = function(req, res, next) {
    res.locals.isUser = req.session.isUser
    res.locals.isModerator = req.session.isModerator
    res.locals.isAdmin = req.session.isAdmin
    res.locals.isSuperAdmin = req.session.isSuperAdmin
    res.locals.role = req.session.role

    res.locals.csrf = req.csrfToken()
    next()
}