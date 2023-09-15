const { TokenExpiredError } = require('jsonwebtoken');
const { generateToken, verifyToken, decodeToken } = require('../../../lib/token');
const { serverError, authenticationError } = require('../../../utils/httpErrors');

beforeAll(() => {
    process.env.ACCEESS_TOKEN_SECRET = 'token123;'
})


describe('Token generation, verification', () => {
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUHJhbnRpayIsImVtYWlsIjoicHJhbnRpa0BnbWFpbC5jb20iLCJwYXNzd29yZCI6IlBAc3N3b3JkMTIzIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjk0Nzg2NDQwLCJleHAiOjE3MjYzNDQwNDB9.oZDz-rDjWHbTRyZNNX2Qd7eCeUFqxhS1hG3Kn9V7Hhc'
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUHJhbnRpayIsImVtYWlsIjoicHJhbnRpa0BnbWFpbC5jb20iLCJwYXNzd29yZCI6IlBAc3N3b3JkMTIzIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjk0Nzg2MzM5LCJleHAiOjE2OTQ3ODYzNDB9.VPGUlJP_JyjOI4gv3k8SMN4Rx4XXJbQB5BfaQ1W7Zg4'

    describe('Token generation', () => {
        it('should generate a jwt token successfully', () => {
            const payload = {
                name: 'Prantik',
                email: 'prantik@gmail.com',
                password: 'P@ssword123',
                role: 'admin'
            }

            const token = generateToken({ payload, expiresIn: '1y' })

            expect(token.length).toBeGreaterThan(60)
        })
    })

    describe('Token Verification', () => {
        it('should return true on valid token', () => {
            const res = verifyToken({ token: validToken })

            expect(res).not.toBeFalsy()
        })

        it('should throw 401 error on expired token', () => {
            const authError = authenticationError('Token expired. Please log in again.')

            expect(() => verifyToken({ token: expiredToken })).toThrow(authError)
        })

        it('should throw server error on expired token', () => {
            expect(() => verifyToken({ token: '' })).toThrow(serverError())
        })
    })

    describe('Token Decoding', () => {
        it('should decode a valid token', () => {
            const expectedOutput = {
                "name": "Prantik",
                "email": "prantik@gmail.com",
                "password": "P@ssword123",
                "role": "admin",
                "iat": 1694786440,
                "exp": 1726344040
            }

            const outupt = decodeToken(validToken)

            expect(outupt).toMatchObject(expectedOutput)
        })

        it('should retrun null on invalid token', () => {
            expect(decodeToken('')).toBeFalsy()
        })
    })
})