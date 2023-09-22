const commentService = require('../../../../lib/comment')

const updatePartially = async (req, res, next) => {
    try {
        const comment = await commentService.updateComment(req.params.id, req.body)

        const response = {
            code: 200,
            message: 'Comment updated successfully',
            data: comment,
            links: {
                self: req.url,
                delete: `comments/${comment.id}`,
                view: `comments/${comment.id}`,
            }
        }

        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}

module.exports = updatePartially