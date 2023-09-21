const postService = require('../../../../lib/post')

const updatePartially = async (req, res, next) => {
    try {
        const post = await postService.updatePost(req.params.id, req.body)

        const response = {
            code: 200,
            message: 'Post updated successfully',
            data: post,
            links: {
                self: req.url,
                delete: `posts/${post.id}`,
                view: `posts/${post.id}`,
            }
        }

        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}

module.exports = updatePartially