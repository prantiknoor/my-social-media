const postService = require("../lib/post")
const { authorizationError } = require("../utils/httpErrors")

const ownership = model => async (req, _res, next) => {
    if (req.user.role === 'admin') return next()

    switch (model) {
        case 'Article':
            const isOwner = await postService.checkOwnership({
                postId: req.params.id,
                userId: req.user.id
            })

            if (isOwner) return next()

            return next(authorizationError())
        default:
            return next()
    }
}

module.exports = ownership