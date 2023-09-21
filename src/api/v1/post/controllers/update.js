const postService = require('../../../../lib/post')

const update = async (req, res, next) => {
    try {
        const { post, code } = await postService.updateOrCreatePost(req.params.id, req.body)

        const message = code === 201 ? 'Post created successfully' : 'Post updated successfully'

        const response = {
            code,
            message,
            data: post,
            links: {
                self: req.url,
                delete: `posts/${post.id}`,
                view: `posts/${post.id}`,
            }
        }

        res.status(code).json(response)
    } catch (error) {
        next(error)
    }
}

module.exports = update