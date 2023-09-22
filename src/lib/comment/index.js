const defaults = require("../../config/defaults")
const { Comment, Post } = require("../../models")
const { notFound } = require("../../utils/httpErrors")
const { incrementCounter } = require("../counter")

const createComment = async ({ body, post, commentor, status }) => {
    const postExist = await Post.findById(post)

    if (!postExist) throw notFound('Post not found')

    const comment = await Comment.create({ body, post, commentor, status })

    await incrementCounter({ parent: post, type: 'comments' })

    return comment
}

const deleteComment = async (id) => {
    const comment = await Comment.findById(id)

    if (!comment) throw notFound()

    await comment.deleteOne()

    await incrementCounter({ parent: comment.post, type: 'comments', incrementBy: -1 })
}

const findSingleComment = async (id) => {
    const comment = await Comment.findById(id)

    if (!comment) throw notFound('Comment not found')

    return comment._doc
}

const findAllComment = async ({
    page = defaults.page,
    limit = defaults.limit,
    sortType = defaults.sortType,
    sortBy = defaults.sortBy,
    post,
}) => {
    const sort = (sortType === 'desc' ? '-' : '') + sortBy

    let filter = post ? { post } : undefined

    const comments = await Comment.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)

    return comments
}

// TODO: Test this function
const countComments = () => Comment.count()

const updateOrCreateComment = async (id, { body, post, commentor, status }) => {
    let comment = await Comment.findById(id)

    const payload = { body, post, commentor, status }

    if (!comment) {
        comment = await createComment({ ...payload })
        return { comment, code: 201 }
    }

    await comment.overwrite(payload).save()

    return { comment, code: 200 }
}

const updateComment = async (id, { body, post, commentor, status }) => {
    let comment = await Comment.findById(id)

    if (!comment) throw notFound()

    const payload = {
        body: body ?? comment.body,
        post: post ?? comment.post,
        commentor: commentor ?? comment.commentor,
        status: status ?? comment.status,
    }

    await comment.overwrite(payload).save()

    return comment
}

// TODO: Test this function
const checkOwnership = async ({ commentId, userId }) => {
    const comment = await Comment.findById(commentId)

    if (!comment) throw notFound()

    return comment.commentor.toString() === userId
}

module.exports = {
    createComment,
    deleteComment,
    findSingleComment,
    findAllComment,
    updateComment,
    updateOrCreateComment,
    countComments,
    checkOwnership
}