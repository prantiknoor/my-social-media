const postService = require('../../../../lib/post')

const deleteSingle = async (req, res, next) => {
    try {
        await postService.deletePost(req.params.id)

        res.status(204).end()
    } catch (error) {
        next(error)
    }
}

module.exports = deleteSingle