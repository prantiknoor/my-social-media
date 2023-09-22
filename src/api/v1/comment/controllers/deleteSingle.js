const commentService = require('../../../../lib/comment')

const deleteSingle = async (req, res, next) => {
    try {
        await commentService.deleteComment(req.params.id)

        res.status(204).end()
    } catch (error) {
        next(error)
    }
}

module.exports = deleteSingle