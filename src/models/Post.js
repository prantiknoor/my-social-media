const { Schema, model } = require('mongoose')

const postSchema = new Schema(
    {
        body: {
            type: String,
            minLength: 2,
            maxLength: 256,
            required: true,
        },
        photo: {
            type: String,
            required: false,
        },
        audience: {
            type: String,
            enum: ['everyone', 'public', 'only_me'],
            default: 'everyone'
        },
        creator: {
            type: Schema.ObjectId,
            ref: 'User'
        }
    },
    {
        id: true,
        timestamps: true,
    })

const Post = model('Post', postSchema)

module.exports = Post