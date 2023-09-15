const { TokenExpiredError } = require('jsonwebtoken');
const { generateToken, verifyToken, decodeToken } = require('../../../lib/token');
const { serverError, authenticationError } = require('../../../utils/httpErrors');

beforeAll(() => {
    process.env.ACCEESS_TOKEN_SECRET = 'token123;'
})


describe('Token generation, verification', () => {
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MDMwZDNlNTY0YzljZTkwMTAzMjQ0YyIsIm5hbWUiOiJQcmFudGlrIiwiZW1haWwiOiJwcmFudGlrQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY5NDc5NDkyNCwiZXhwIjoxNzI2MzUyNTI0fQ.fSXhx1ycH7eNvI6kgXQCbWPK8TzbMEEDaV15QJjtfAE'
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUHJhbnRpayIsImVtYWlsIjoicHJhbnRpa0BnbWFpbC5jb20iLCJwYXNzd29yZCI6IlBAc3N3b3JkMTIzIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjk0Nzg2MzM5LCJleHAiOjE2OTQ3ODYzNDB9.VPGUlJP_JyjOI4gv3k8SMN4Rx4XXJbQB5BfaQ1W7Zg4'

    describe('Token generation', () => {
        it('should generate a jwt token successfully', () => {
            const payload = {
                id: "65030d3e564c9ce90103244c",
                name: "Prantik",
                email: "prantik@gmail.com",
                role: "admin"
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
                "id": "65030d3e564c9ce90103244c",
                "name": "Prantik",
                "email": "prantik@gmail.com",
                "role": "admin",
                "iat": 1694794924,
                "exp": 1726352524
            }

            const outupt = decodeToken(validToken)

            expect(outupt).toMatchObject(expectedOutput)
        })

        it('should retrun null on invalid token', () => {
            expect(decodeToken('')).toBeFalsy()
        })
    })
})