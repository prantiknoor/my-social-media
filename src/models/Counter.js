const { Schema, model } = require('mongoose')

const counterSchema = new Schema(
    {
        parent: {
            type: Schema.ObjectId,
            required: true
        },
        count: {
            type: Number,
            required: true,
            default: 0
        },
        type: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    })

const Counter = model('Counter', counterSchema)

module.exports = Counter