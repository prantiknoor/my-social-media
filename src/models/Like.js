const { Schema, model } = require('mongoose')

const likeSchema = new Schema(
    {
        liker: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        post: {
            type: Schema.ObjectId,
            ref: 'Post'
        }
    },
    {
        id: false,
        timestamps: true,
    })

const Like = model('Like', likeSchema)

module.exports = Like