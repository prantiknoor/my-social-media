const tokenService = require('../lib/token')
const userService = require('../lib/user')
const { authenticationError } = require('../utils/httpErrors')

const authenticate = async (req, _res, next) => {
    const token = req.headers.authorization?.split(' ')?.at(1)
    try {
        const { id } = tokenService.verifyToken({ token })

        const user = await userService.findUserById(id)

        if (!user) throw new Error() // it will handle on catch block

        if (user.status === 'banned') {
            return next(authenticationError('Your account is banned'))
        }

        req.user = { id: user.id, ...user._doc }

        next()
    } catch (e) {
        next(authenticationError())
    }
}

module.exports = authenticate