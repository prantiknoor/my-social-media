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
            default: 'public'
        },
        commentor: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        post: {
            type: Schema.ObjectId,
            ref: 'Post'
        }
    },
    {
        id: true,
        timestamps: true,
    })

const Comment = model('Comment', commentSchema)

module.exports = Comment