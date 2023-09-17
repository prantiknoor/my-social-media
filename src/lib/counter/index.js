const { Counter } = require("../../models")
const { notFound } = require("../../utils/httpErrors")

const createCounter = async ({ parent, type }) => {
    const counterExist = await Counter.findOne({ parent, type })

    if (counterExist) throw new Error('Counter already exist ')

    const counter = await Counter.create({ parent, type })

    return counter
}

const findCounter = async ({ parent, type }) => {
    const counter = await Counter.findOne({ parent, type })

    if (!counter) throw notFound()

    return counter
}

/**
 * It will create a new counter if it doesn't find any
 */
const incrementCounter = async ({ parent, type, incrementBy = 1 }) => {
    const counter = await Counter.findOne({ parent, type })

    if (!counter) {
        return await Counter.create({ parent, type, count: incrementBy })
    }

    const count = counter.count + incrementBy

    await counter.updateOne({ count })

    return counter
}

module.exports = {
    createCounter,
    findCounter,
    incrementCounter
}