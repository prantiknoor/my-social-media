const { badRequest } = require("../../utils/httpErrors")
const { createUser, findUserByEmail } = require("../user")
const { generateHash } = require('../../utils/hashing')
const { generateToken } = require('../../lib/token')
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

module.exports = { register }