const postService = require('../../../../lib/post')

const findSingle = async (req, res, next) => {
    try {
        const post = await postService.findSinglePost(req.params.id)
        const code = 200

        const response = {
            code,
            message: 'Post found',
            data: post,
            links: {
                self: req.url,
                like: `/posts/${post.id}/like`,
                comment: `/posts/${post.id}/comment`,
            }
        }

        res.status(code).json(response)
    } catch (error) {
        next(error)
    }
}

module.exports = findSingle