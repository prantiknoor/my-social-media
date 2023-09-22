const postService = require("../lib/post")
const commentService = require("../lib/comment")
const { authorizationError } = require("../utils/httpErrors")

const ownership = model => async (req, _res, next) => {
    if (req.user.role === 'admin') return next()

    let isOwner

    try {
        switch (model) {
            case 'Post':
                isOwner = await postService.checkOwnership({
                    postId: req.params.id,
                    userId: req.user.id
                })

                if (isOwner) return next()

                return next(authorizationError())
            case 'Comment':
                isOwner = await commentService.checkOwnership({
                    commentId: req.params.id,
                    userId: req.user.id
                })

                if (isOwner) return next()

                return next(authorizationError())
            default:
                return next()
        }
    } catch (error) {
        next(error)
    }
}

module.exports = ownership