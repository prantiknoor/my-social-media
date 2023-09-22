const followService = require('../../../../lib/follow')

const follow = async (req, res, next) => {
    try {
        const { code, data } = await followService.follow({
            followee: req.params.id,
            follower: req.user.id
        })

        const response = {
            code,
            message: 'Followed successfully',
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

module.exports = follow