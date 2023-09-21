const { Schema, model } = require('mongoose')

const postSchema = new Schema(
    {
        body: {
            type: String,
            minLength: 1,
            maxLength: 256,
            required: true,
        },
        photo: String,
        commenting: {
            type: Boolean,
            required: true,
            default: true
        },
        audience: {
            type: String,
            enum: ['everyone', 'public', 'only_me'],
            default: 'everyone',
            required: true
        },
        creator: {
            type: Schema.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        id: true,
        timestamps: true,
    })

const Post = model('Post', postSchema)

module.exports = Post