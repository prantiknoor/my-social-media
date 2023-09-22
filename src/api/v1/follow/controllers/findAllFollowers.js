const defaults = require('../../../../config/defaults')
const followService = require('../../../../lib/follow')
const counterService = require('../../../../lib/counter')
const { getPagination, getPaginationLinks } = require('../../../../utils/query')

const findAllFollowers = async (req, res, next) => {
    const limit = req.query.limit ?? defaults.limit
    const page = req.query.page ?? defaults.page

    try {
        const userId = req.params.id
        const followers = await followService.findFollowersOf(userId, req.query ?? {})

        const data = followers

        // Pagination
        const totalItems = (await counterService.findCounter({
            parent: userId,
            type: 'followers'
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

module.exports = findAllFollowers