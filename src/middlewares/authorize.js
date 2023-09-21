const { authorizationError } = require('../utils/httpErrors')

const authorize = (roles = ['admin']) => (req, _res, next) => {
    if (roles.includes(req.user?.role)) return next()

    next(authorizationError())
}

module.exports = authorize