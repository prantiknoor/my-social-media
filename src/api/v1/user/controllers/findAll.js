const defaults = require('../../../../config/defaults')
const userService = require('../../../../lib/user')
const { getPagination, getPaginationLinks } = require('../../../../utils/query')

const findAll = async (req, res, next) => {
    const search = req.query.search ?? defaults.search
    const limit = req.query.limit ?? defaults.limit
    const page = req.query.page ?? defaults.page

    try {
        const users = await userService.findAllUser(req.query ?? {})

        // TODO: add links and hide sesitive properties
        const data = users

        // Pagination
        const totalItems = await userService.countUser(search)
        const pagination = getPagination({ totalItems, limit, page })

        const links = getPaginationLinks({
            page,
            url: req.url,
            path: req.path,
            query: req.query,
            hasNext: pagination.next,
            hasPrev: pagination.prev,
        })

        res.status(201).json({
            data,
            pagination,
            links
        })
    } catch (error) {
        next(error)
    }
}

module.exports = findAll