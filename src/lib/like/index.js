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

module.exports = {
    likePost,
    deleteLike
}