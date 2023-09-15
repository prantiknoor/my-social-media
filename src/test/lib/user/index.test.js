const { createUser, deleteUser, findSingleUser, findAllUser, updateOrCreateUser, updateUser } = require('../../../lib/user')
const { connectDB } = require('../../../db')
const { User } = require('../../../models')
const { notFound } = require('../../../utils/httpErrors');
const mongoose = require('mongoose');
const { getFakeUserCreationData, createRandomUser } = require('../../helpers');

beforeAll(async () => {
    await connectDB(true)
})

afterAll(async () => {
    await User.deleteMany()
    await mongoose.connection.close(true)
})

const randomId = '65030d3e564c9ce90103244c'

describe('USER', () => {
    describe('User creation', () => {
        it('should create an user and return with same data', async () => {
            const data = getFakeUserCreationData()

            const user = await createUser(data)

            expect(user.name).toBe(data.name)
            expect(user.email).toBe(data.email)
            expect(user.password).toBe(data.password)
        })
    })

    describe('User deletion', () => {
        it('should delete an user', async () => {
            const { user } = await createRandomUser()

            await deleteUser(user.id)
        })

        it('should throw not found error', async () => {
            expect(deleteUser(randomId)).rejects.toThrow(notFound())
        })
    })

    describe('Single user finding', () => {
        it('should find an user with followers and followees', async () => {
            const { user } = await createRandomUser()

            const res = await findSingleUser(user.id)

            expect(res).not.toBeFalsy()
            expect(res._doc.followers).toBe(0)
            expect(res._doc.followees).toBe(0)
        })

        it('should throw not found error', async () => {
            expect(findSingleUser(randomId)).rejects.toThrow(notFound())
        })
    })

    describe('All user finding', () => {
        beforeAll(async () => {
            for (let i = 0; i < 5; i++) {
                await createRandomUser()
            }
        })

        it('should return a list of users not more than limit', async () => {
            const limit = 2;
            const users = await findAllUser({ limit })

            expect(users.length).not.toBeGreaterThan(limit)
        })

        it('should return a list of users ommitting password and status', async () => {
            const users = await findAllUser({ limit: 2 })

            expect(users[0]).not.toHaveProperty('password')
            expect(users[1]).not.toHaveProperty('status')

            // console.log(users);
        })
    })

    describe('Updating user (PUT)', () => {
        it('should update user and return 200 code', async () => {
            const { user } = await createRandomUser()
            const newData = getFakeUserCreationData()

            const { user: updatedUser, code } = await updateOrCreateUser(user.id, { ...newData })

            expect(code).toBe(200)

            expect(updatedUser.name).toBe(newData.name)
            expect(updatedUser.email).toBe(newData.email)
            expect(updatedUser.bio).toBe(newData.bio)
            expect(updatedUser.password).toBe(newData.password)
        })

        it('should not find user then create a new user', async () => {
            const data = getFakeUserCreationData()

            const { user, code } = await updateOrCreateUser(randomId, { ...data })

            expect(code).toBe(201)

            expect(user.name).toBe(data.name)
            expect(user.email).toBe(data.email)
            expect(user.bio).toBe(data.bio)
            expect(user.password).toBe(data.password)
        })
    })

    describe('Updating user (PATCH)', () => {
        it('should update user', async () => {
            const { user } = await createRandomUser()
            const { name, bio } = getFakeUserCreationData()

            const updatedUser = await updateUser(user.id, { name, bio })

            expect(updatedUser.name).toBe(name)
            expect(updatedUser.bio).toBe(bio)
        })

        it('should throw notFound error', async () => {
            const data = getFakeUserCreationData()

            expect(updateUser(randomId, { ...data })).rejects.toThrow(notFound())
        })
    })
})