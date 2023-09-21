const { Schema, model } = require('mongoose')

const commentSchema = new Schema(
    {
        body: {
            type: String,
            minLength: 2,
            maxLength: 128,
            required: true,
        },
        status: {
            type: String,
            enum: ['public', 'hidden'],
            required: true,
            default: 'public'
        },
        commentor: {
            type: Schema.ObjectId,
            ref: 'User',
            required: true
        },
        post: {
            type: Schema.ObjectId,
            ref: 'Post',
            required: true
        }
    },
    {
        id: true,
        timestamps: true,
    })

const Comment = model('Comment', commentSchema)

module.exports = Comment