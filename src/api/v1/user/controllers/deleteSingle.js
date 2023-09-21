const userService = require('../../../../lib/user')

const deleteSingle = async (req, res, next) => {
    try {
        await userService.deleteUser(req.params.id)

        res.status(204).end()
    } catch (error) {
        next(error)
    }
}

module.exports = deleteSingle