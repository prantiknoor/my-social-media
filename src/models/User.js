const { Schema, model } = require('mongoose')

const userSchema = new Schema(
    {
        name: {
            type: String,
            minLength: 3,
            maxLength: 30,
            required: true,
        },
        bio: {
            type: String,
            maxLength: 256,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            minLength: 6,
            maxLength: 100,
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        status: {
            type: String,
            enum: ['unverified', 'verified', 'banned'],
            default: 'unverified'
        }
    },
    {
        id: true,
        timestamps: true,
    })

const User = model('User', userSchema)

module.exports = User