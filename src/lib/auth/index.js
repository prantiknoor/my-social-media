const { badRequest } = require("../../utils/httpErrors")
const { createUser, findUserByEmail } = require("../user")
const { generateHash, hashMatched } = require('../../utils/hashing')
const { generateAccessTokenFromUser } = require("./utils")

const register = async ({ name, email, password }) => {
    const userExist = await findUserByEmail(email)

    if (userExist) throw badRequest('User already exist.')

    const hashedPassword = await generateHash(password);

    const user = await createUser({ name, email, password: hashedPassword })

    const token = generateAccessTokenFromUser(user)

    // removes sensative properties
    delete user._doc['password']
    delete user._doc['status']

    return { user: user._doc, token }
}

const login = async ({ email, password }) => {
    const user = await findUserByEmail(email)

    if (!user) throw badRequest('Invalid credentials')

    // password validation
    const matched = await hashMatched(password, user.password)

    if (!matched) throw badRequest('Invalid credentials')

    const token = generateAccessTokenFromUser(user)

    return token
}

module.exports = { register, login }