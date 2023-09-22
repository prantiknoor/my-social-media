const likeService = require('../../../../lib/like')

const deleteLike = async (req, res, next) => {
    try {
        await likeService.deleteLike({
            postId: req.params.id,
            likerId: req.user.id
        })

        res.status(204).end()
    } catch (error) {
        next(error)
    }
}

module.exports = deleteLike