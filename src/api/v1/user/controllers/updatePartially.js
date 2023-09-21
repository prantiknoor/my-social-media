const userService = require('../../../../lib/user')

const updatePartially = async (req, res, next) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body)

        const response = {
            code: 200,
            message: 'User updated successfully',
            data: user,
            links: {
                self: req.url,
                delete: `users/${user.id}`,
                view: `users/${user.id}`,
            }
        }

        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}

module.exports = updatePartially