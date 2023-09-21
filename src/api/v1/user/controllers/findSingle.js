const userService = require('../../../../lib/user')

const findSingle = async (req, res, next) => {
    try {
        const user = await userService.findSingleUser(req.params.id)

        const response = {
            code: 200,
            message: 'User found',
            data: user,
            links: {
                self: req.url,
                posts: `/users/${user.id}/posts`,
            }
        }

        res.status(201).json(response)
    } catch (error) {
        next(error)
    }
}

module.exports = findSingle