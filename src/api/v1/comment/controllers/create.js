const commentService = require('../../../../lib/comment')

const create = async (req, res, next) => {
    try {
        const data = { ...req.body, commentor: req.user.id }

        if (req.params.id) data.post = req.params.id

        const comment = await commentService.createComment(data)

        const response = {
            code: 201,
            message: 'Comment created successfully',
            data: comment,
            links: {
                self: req.url,
                edit: `comments/${comment.id}`,
                delete: `comments/${comment.id}`,
            }
        }

        res.status(201).json(response)
    } catch (error) {
        next(error)
    }
}

module.exports = create