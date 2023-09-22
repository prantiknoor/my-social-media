const postService = require('../../../../lib/post')
const counterService = require('../../../../lib/counter')

const create = async (req, res, next) => {
    try {
        const data = { ...req.body, creator: req.user.id }

        const post = await postService.createPost(data)

        await counterService.createCounter({
            parent: post.id,
            type: 'likes'
        })

        await counterService.createCounter({
            parent: post.id,
            type: 'comments'
        })

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