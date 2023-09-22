const defaults = require('../../../../config/defaults')
const postService = require('../../../../lib/post')
const { getPagination, getPaginationLinks } = require('../../../../utils/query')

const findAll = async (req, res, next) => {
    const search = req.query.search ?? defaults.search
    const limit = req.query.limit ?? defaults.limit
    const page = req.query.page ?? defaults.page

    try {
        const posts = await postService.findAllPost(req.query ?? {})

        // TODO: add links and hide sesitive properties
        const data = posts

        // Pagination
        const totalItems = await postService.countPost(search)
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