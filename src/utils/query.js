const defaults = require("../config/defaults");

const getPagination = ({
    totalItems,
    limit = defaults.limit,
    page = defaults.page
}) => {
    const totalPage = Math.ceil(totalItems / limit)

    const pagination = {
        page,
        limit,
        totalItems,
        totalPage
    }

    if (page < totalPage) pagination.next = page + 1
    if (page > 1) pagination.prev = page - 1

    return pagination
}

const getPaginationLinks = ({
    url = '/',
    path = '',
    query = {},
    hasNext = false,
    hasPrev = false,
    page = 1
}) => {
    const links = { self: url }

    if (hasNext) {
        const queryStr = generateQueryStr({ ...query, page: page + 1 })
        links.next = path + '?' + queryStr
    }

    if (hasPrev) {
        const queryStr = generateQueryStr({ ...query, page: page - 1 })
        links.prev = path + '?' + queryStr
    }

    return links
}

const generateQueryStr = query => Object.keys(query).map(
    key => encodeURI(key + '=' + query[key])
).join('&')

module.exports = {
    getPagination,
    getPaginationLinks,
    generateQueryStr
}