const postService = require('../../../../lib/post')

const create = async (req, res, next) => {
    try {
        const post = await postService.createPost(req.body)

        const response = {
            code: 201,
            message: 'Post created successfully',
            data: post,
            links: {
                self: req.url,
                edit: `posts/${post.id}`,
                delete: `posts/${post.id}`,
                view: `posts/${post.id}`,
            }
        }

        res.status(201).json(response)
    } catch (error) {
        next(error)
    }
}

module.exports = create