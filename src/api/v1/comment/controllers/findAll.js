const defaults = require('../../../../config/defaults')
const commentService = require('../../../../lib/comment')
const counterService = require('../../../../lib/counter')
const { getPagination, getPaginationLinks } = require('../../../../utils/query')

const findAll = async (req, res, next) => {
    const limit = req.query.limit ?? defaults.limit
    const page = req.query.page ?? defaults.page

    try {
        const params = { ...req.query }
        const postId = req.params.id
        if (postId) params.post = postId

        const comments = await commentService.findAllComment(params)

        // TODO: add links and hide sesitive properties
        const data = comments

        // Pagination
        const totalItems = postId ? (await counterService.findCounter({
            parent: postId,
            type: 'comments'
        })).count : await commentService.countComments()

        const pagination = getPagination({ totalItems, limit, page })

        const links = getPaginationLinks({
            page,
            url: req.url,
            path: req.path,
            query: req.query,
            hasNext: pagination.next,
            hasPrev: pagination.prev,
        })

        const code = 200
        res.status(code).json({
            code,
            data,
            pagination,
            links
        })
    } catch (error) {
        next(error)
    }
}

module.exports = findAll