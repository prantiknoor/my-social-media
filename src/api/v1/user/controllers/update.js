const userService = require('../../../../lib/user')

const update = async (req, res, next) => {
    try {
        const { user, code } = await userService.updateOrCreateUser(req.params.id, req.body)

        const message = code === 201 ? 'User created successfully' : 'User updated successfully'

        const response = {
            code,
            message,
            data: user,
            links: {
                self: req.url,
                delete: `users/${user.id}`,
                view: `users/${user.id}`,
            }
        }

        res.status(code).json(response)
    } catch (error) {
        next(error)
    }
}

module.exports = update