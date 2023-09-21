const authService = require('../../../../lib/auth')

const register = async (req, res, next) => {
    try {
        const { token } = await authService.register(req.body)

        const response = {
            code: 201,
            message: 'Registration successful',
            data: {
                access_token: token
            },
            links: {
                self: req.url,
            }
        }

        res.status(201).json(response)
    } catch (error) {
        next(error)
    }
}

module.exports = register