const jwt = require('jsonwebtoken');
const { serverError, authenticationError } = require('../../utils/httpErrors');

const generateToken = ({
    payload,
    algorithm = 'HS256',
    secret = process.env.ACCEESS_TOKEN_SECRET,
    expiresIn = '1d'
}) => {
    return jwt.sign(payload, secret, { algorithm, expiresIn })
}

const verifyToken = ({
    token,
    algorithm = 'HS256',
    secret = process.env.ACCEESS_TOKEN_SECRET
}) => {
    try {
        return jwt.verify(token, secret, { algorithms: [algorithm] })
    } catch (error) {
        console.log(error);
        if (error.name === 'TokenExpiredError') {
            throw authenticationError('Token expired. Please log in again.')
        } else {
            throw serverError()
        }
    }
}

const decodeToken = (token) => {
    return jwt.decode(token)
}

module.exports = {
    generateToken,
    verifyToken,
    decodeToken
}