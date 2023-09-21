const authService = require('../../../../lib/auth')

const login = async (req, res, next) => {
    try {
        const token = await authService.login(req.body)

        const response = {
            code: 200,
            message: 'Login successful',
            data: {
                access_token: token
            },
            links: {
                self: req.url,
            }
        }

        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}

module.exports = login