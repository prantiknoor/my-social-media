const mongoose = require('mongoose')
const { badRequest } = require('../../../utils/httpErrors')
const { connectDB } = require('../../../db')
const { getFakeUserCreationData, createRandomUser } = require('../../helpers')
const { register, login } = require('../../../lib/auth')
const { User } = require('../../../models')

beforeAll(async () => {
    await connectDB(true)
    process.env.ACCEESS_TOKEN_SECRET = 'token123;'
})

afterAll(async () => {
    await User.deleteMany()
    await mongoose.connection.close(true)
})

describe('Authentication', () => {
    describe('Registration', () => {
        it('should create a new user and return user (ommitting password) and token', async () => {
            const { name, email, password } = getFakeUserCreationData()

            const { user, token } = await register({ name, email, password })

            expect(user.name).toBe(name)
            expect(user.email).toBe(email)
            expect(user.password).toBeUndefined()
            expect(user.status).toBeUndefined()

            expect(token.length).toBeGreaterThan(60)
        })

        it('should throw badRequest error because user already exist with the email', async () => {
            const { user } = await createRandomUser()

            return expect(register({
                name: 'Prantik',
                email: user.email,
                password: 'password123'
            })).rejects.toThrow(badRequest('User already exist.'))
        })
    })

    describe('Login', () => {
        it('should throw badRequest error for user not found by the email', () => {
            const email = 'hello123@gmail.com'
            const password = 'helloq234'

            return expect(login({ email, password })).rejects.toThrow(badRequest('Invalid credentials'))
        })

        it('should throw badRequest error for password doesn\'t match', async () => {
            const { data: { email } } = await createRandomUser()
            const password = 'helloq234'

            return expect(login({ email, password })).rejects.toThrow(badRequest('Invalid credentials'))
        })

        it('should log in successfully and return access token', async () => {
            const { name, email, password } = getFakeUserCreationData()
            await register({ name, email, password })

            const token = await login({ email, password })

            expect(token.length).toBeGreaterThan(60)
        })
    })
})