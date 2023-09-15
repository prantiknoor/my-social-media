const { Schema, model } = require('mongoose')

const followerSchema = new Schema(
    {
        parent: {
            type: Schema.ObjectId,
        },
        count: {
            type: Number,
            ref: 'User'
        },
        type: String
    },
    {
        id: false,
        timestamps: true,
    })

const Counter = model('Counter', followerSchema)

module.exports = Counter