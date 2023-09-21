const postService = require('../../../../lib/post')

const findSingle = async (req, res, next) => {
    try {
        const post = await postService.findSinglePost(req.params.id)

        const response = {
            code: 200,
            message: 'Post found',
            data: post,
            links: {
                self: req.url,
                like: `/posts/${post.id}/like`,
                comment: `/posts/${post.id}/comment`,
            }
        }

        res.status(201).json(response)
    } catch (error) {
        next(error)
    }
}

module.exports = findSingle