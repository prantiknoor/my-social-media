const mongoose = require('mongoose')
const { connectDB } = require('../../../db')
const { notFound } = require('../../../utils/httpErrors')
const { createRandomPost, createRandomUser } = require("../../helpers")
const { findCounter } = require('../../../lib/counter')
const { likePost, deleteLike } = require('../../../lib/like')

beforeAll(async () => {
    await connectDB(true)
})

afterAll(async () => {
    await mongoose.connection.close(true)
})

describe('Post Liking', () => {
    const randomPostId = '6506d176b40d591e4fddb5e4'
    let postId, likerId

    beforeAll(async () => {
        const { user } = await createRandomUser()
        const { post } = await createRandomPost({})
        likerId = user.id
        postId = post.id
    })

    describe('Like a post', () => {
        it('should throw notFound error because the doesn\'t exist', () => {
            return expect(likePost({ postId: randomPostId, likerId })).rejects.toThrow(notFound())
        })

        it('should like the post and like counter should be increased', async () => {

            const { code } = await likePost({ postId, likerId })

            const likeCounter = await findCounter({ parent: postId, type: 'likes' })

            expect(code).toBe(201)

            expect(likeCounter.count).toBe(1)
        })

        it('should return 200 code because the post is already liked', async () => {
            // post#postId has already liked by user#likerId in previous test
            const { code } = await likePost({ postId, likerId })

            expect(code).toBe(200)
        })
    })

    describe('Remove like from a post', () => {
        it('should throw notFound error because wasn\'t liked', () => {
            return expect(deleteLike({ postId: randomPostId, likerId })).rejects.toThrow(notFound())
        })

        it('should delete like from post and like counter should be decreased', async () => {
            // post#postId has already liked by user#likerId in previous test
            await deleteLike({ postId, likerId })

            const likeCounter = await findCounter({ parent: postId, type: 'likes' })

            expect(likeCounter.count).toBe(0)
        })
    })
})