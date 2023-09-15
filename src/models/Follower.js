const { Schema, model } = require('mongoose')

const followerSchema = new Schema(
    {
        follower: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        followee: {
            type: Schema.ObjectId,
            ref: 'User'
        }
    },
    {
        id: false,
        timestamps: true,
    })

const Follower = model('Follower', followerSchema)

module.exports = Follower