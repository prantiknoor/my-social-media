const defaults = require("../../config/defaults")
const { Post, Like } = require("../../models")
const { notFound } = require("../../utils/httpErrors")
const { incrementCounter } = require("../counter")

const likePost = async ({ postId, likerId }) => {
    const postExist = await Post.findById(postId)

    if (!postExist) throw notFound()

    let code = 200
    let like = await Like.findOne({ post: postId, liker: likerId })

    if (!like) {
        like = await Like.create({ post: postId, liker: likerId })

        await incrementCounter({ parent: postId, type: 'likes' })

        code = 201
    }

    return { like, code }
}

const deleteLike = async ({ postId, likerId }) => {
    let like = await Like.findOne({ post: postId, liker: likerId })

    if (!like) throw notFound()

    await like.deleteOne()

    await incrementCounter({ parent: postId, type: 'likes', incrementBy: -1 })
}

// TODO: Test this function
const findLikesOfPost = async (postId, {
    page = defaults.page,
    limit = defaults.limit,
    sortType = defaults.sortType,
    sortBy = defaults.sortBy,
}) => {
    const sort = (sortType === 'desc' ? '-' : '') + sortBy
    const filter = {
        post: postId
    }

    const likes = await Like.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)

    return likes
}

module.exports = {
    likePost,
    deleteLike,
    findLikesOfPost
}