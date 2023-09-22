const likeService = require('../../../../lib/like')

const likePost = async (req, res, next) => {
    try {
        const { code, like } = await likeService.likePost({
            postId: req.params.id,
            likerId: req.user.id
        })

        const response = {
            code,
            message: 'Liked the post successfully',
            data: like,
            links: {
                self: req.url,
            }
        }

        res.status(code).json(response)
    } catch (error) {
        next(error)
    }
}

module.exports = likePost