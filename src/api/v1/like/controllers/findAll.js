const defaults = require('../../../../config/defaults')
const likeService = require('../../../../lib/like')
const counterService = require('../../../../lib/counter')
const { getPagination, getPaginationLinks } = require('../../../../utils/query')

const findAll = async (req, res, next) => {
    const limit = req.query.limit ?? defaults.limit
    const page = req.query.page ?? defaults.page

    try {
        const postId = req.params.id
        const likes = await likeService.findLikesOfPost(postId, req.query ?? {})

        const data = likes

        // Pagination
        const totalItems = (await counterService.findCounter({
            parent: postId,
            type: 'likes'
        })).count
        const pagination = getPagination({ totalItems, limit, page })

        const links = getPaginationLinks({
            page,
            url: req.url,
            path: req.path,
            query: req.query,
            hasNext: pagination.next,
            hasPrev: pagination.prev,
        })

        res.status(200).json({
            data,
            pagination,
            links
        })
    } catch (error) {
        next(error)
    }
}

module.exports = findAll