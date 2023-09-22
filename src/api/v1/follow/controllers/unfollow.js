const followService = require('../../../../lib/follow')

const unfollow = async (req, res, next) => {
    try {
        const { code, data } = await followService.unfollow({
            followee: req.params.id,
            follower: req.user.id
        })

        const response = {
            code,
            message: 'Unfollowed successfully',
            data,
            links: {
                self: req.url,
            }
        }

        res.status(code).json(response)
    } catch (error) {
        next(error)
    }
}

module.exports = unfollow