const { generateToken } = require('../../lib/token')

const generateAccessTokenFromUser = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    return generateToken({ payload })
}

module.exports = {
    generateAccessTokenFromUser
}