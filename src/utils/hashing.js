const { hash, genSalt, compare } = require('bcryptjs')

const generateHash = async (payload, round=10) => {
    const salt = await genSalt(round)
    return hash(payload, salt)
}

const hashMatched = (raw, hash) => compare(raw, hash)

module.exports = {
    generateHash,
    hashMatched
}