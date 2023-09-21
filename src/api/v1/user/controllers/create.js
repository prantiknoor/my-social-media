const userService = require('../../../../lib/user')

const create = async (req, res, next) => {
    try {
        const user = await userService.createUser(req.body)

        const response = {
            code: 201,
            message: 'User created successfully',
            data: user,
            links: {
                self: req.url,
                edit: `users/${user.id}`,
                delete: `users/${user.id}`,
                view: `users/${user.id}`,
            }
        }

        res.status(201).json(response)
    } catch (error) {
        next(error)
    }
}

module.exports = create