const mongoose = require('mongoose')
const User = require('../../../models/User')
const { connectDB } = require('../../../db')
const { createRandomUser } = require("../../helpers")
const { notFound } = require('../../../utils/httpErrors')
const { findCounter, createCounter } = require('../../../lib/counter')
const { follow, unfollow } = require('../../../lib/follow')
const { Follower, Counter } = require('../../../models')

beforeAll(async () => {
    await connectDB(true)
    await Follower.deleteMany()
    await Counter.deleteMany()
})

afterAll(async () => {
    await User.deleteMany()
    await mongoose.connection.close(true)
})

describe('Follow Unfollow a user', () => {
    let users = [];

    beforeAll(async () => {
        for (let i = 0; i < 2; i++) {
            const { user } = await createRandomUser()

            await createCounter({ parent: user.id, type: 'followers' })
            await createCounter({ parent: user.id, type: 'followees' })

            users.push(user)
        }
    })

    describe('Follow a user', () => {
        it('should throw notFound error because user does\'t exist', () => {
            const followeeId = '65030d3e564c9ce90103244c' // random id
            const followerId = users[0].id

            return expect(follow({ followee: followeeId, follower: followerId }))
                .rejects.toThrow(notFound('Followee not found'))
        })


        it('should follow a user successfully, followees and followers count should be increased', async () => {
            const followeeId = users[0].id
            const followerId = users[1].id

            const prevFolloweeCount = (await findCounter({ parent: followeeId, type: 'followers' })).count
            const prevFollowerCount = (await findCounter({ parent: followerId, type: 'followees' })).count

            const { code } = await follow({ followee: followeeId, follower: followerId })

            const currFolloweeCount = (await findCounter({ parent: followeeId, type: 'followers' })).count
            const currFollowerCount = (await findCounter({ parent: followerId, type: 'followees' })).count

            expect(code).toBe(201)

            expect(currFolloweeCount).toBe(prevFolloweeCount + 1)
            expect(currFollowerCount).toBe(prevFollowerCount + 1)
        })

        it('should return 200 code (already following)', async () => {
            const followeeId = users[0].id
            const followerId = users[1].id

            const { code } = await follow({ followee: followeeId, follower: followerId })

            expect(code).toBe(200)
        })
    })

    describe('Unfollow a user', () => {
        it('should unfollow a user successfully, followees and followers count should be decreased', async () => {
            const followeeId = users[0].id
            const followerId = users[1].id

            const prevFolloweeCount = (await findCounter({ parent: followeeId, type: 'followers' })).count
            const prevFollowerCount = (await findCounter({ parent: followerId, type: 'followees' })).count

            const { code } = await unfollow({ followee: followeeId, follower: followerId })

            const currFolloweeCount = (await findCounter({ parent: followeeId, type: 'followers' })).count
            const currFollowerCount = (await findCounter({ parent: followerId, type: 'followees' })).count

            expect(code).toBe(204)

            expect(currFolloweeCount).toBe(prevFolloweeCount - 1)
            expect(currFollowerCount).toBe(prevFollowerCount - 1)
        })

        it('should return 200 code (already unfollowed)', async () => {
            const followeeId = users[0].id
            const followerId = users[1].id

            const { code } = await unfollow({ followee: followeeId, follower: followerId })

            expect(code).toBe(200)
        })
    })
})
