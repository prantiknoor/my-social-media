const { Schema, model } = require('mongoose')

const followerSchema = new Schema(
    {
        parent: {
            type: Schema.ObjectId,
        },
        count: {
            type: Number,
            default: 0
        },
        type: String
    },
    {
        timestamps: true,
    })

const Counter = model('Counter', followerSchema)

module.exports = Counter