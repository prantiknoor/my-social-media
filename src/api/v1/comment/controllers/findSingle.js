const commentService = require('../../../../lib/comment')

const findSingle = async (req, res, next) => {
    try {
        const comment = await commentService.findSingleComment(req.params.id)
        const code = 200

        const response = {
            code,
            message: 'Comment found',
            data: comment,
            links: {
                self: req.url,
                edit: `/comments/${comment.id}`,
                delete: `/comments/${comment.id}`,
            }
        }

        res.status(code).json(response)
    } catch (error) {
        next(error)
    }
}

module.exports = findSingle