const commentService = require('../../../../lib/comment')

const update = async (req, res, next) => {
    try {
        const { comment, code } = await commentService.updateOrCreateComment(req.params.id, req.body)

        const message = code === 201 ? 'Comment created successfully' : 'Comment updated successfully'

        const response = {
            code,
            message,
            data: comment,
            links: {
                self: req.url,
                delete: `comments/${comment.id}`,
                view: `comments/${comment.id}`,
            }
        }

        res.status(code).json(response)
    } catch (error) {
        next(error)
    }
}

module.exports = update