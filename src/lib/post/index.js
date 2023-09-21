const { Post } = require("../../models");
const { notFound } = require("../../utils/httpErrors");
const { findCounter } = require("../../../src/lib/counter");
const defaults = require("../../config/defaults");

const createPost = async ({ creator, body, photo, commenting, audience }) => {
    const post = await Post.create({ creator, body, photo, commenting, audience })

    return post;
}

const deletePost = async (id) => {
    const post = await Post.findById(id)

    if (!post) throw notFound('Post not found')

    await post.deleteOne()
}

const findSinglePost = async (id, extend = true) => {
    const post = await Post.findById(id)

    if (!post) throw notFound('Post not found')

    if (extend) {
        try {
            const likesCounter = await findCounter({ parent: post.id, type: 'likes' })
            const commentsCounter = await findCounter({ parent: post.id, type: 'comments' })

            post._doc.likes = likesCounter.count
            post._doc.comments = commentsCounter.count
        } catch (error) {
            post._doc.likes = 0
            post._doc.comments = 0
        }
    }

    return post._doc
}

const findAllPost = async ({
    page = defaults.page,
    limit = defaults.limit,
    sortType = defaults.sortType,
    sortBy = defaults.sortBy,
    search = defaults.search,
}) => {
    const sort = (sortType === 'desc' ? '-' : '') + sortBy
    const filter = {
        body: { $regex: search, $options: 'i' }
    }

    const posts = await Post.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)

    return posts
}

// TODO: Test this function
const countPost = async (search = '') => {
    const filter = {
        body: { $regex: search, $options: 'i' }
    }
    return Post.count(filter)
}

// TODO: Test this function
const checkOwnership = async ({ postId, userId }) => {
    const post = await Post.findById(postId)

    if (!post) throw notFound()

    return post.creator.toString() === userId
}

const updateOrCreatePost = async (id, { creator, body, photo, commenting, audience }) => {
    let post = await Post.findById(id)

    const payload = { creator, body, photo, commenting, audience }

    if (!post) {
        post = await createPost({ ...payload })
        return { post, code: 201 }
    }

    await post.overwrite(payload).save()

    return { post, code: 200 }
}

const updatePost = async (id, { creator, body, photo, commenting, audience }) => {
    let post = await Post.findById(id)

    if (!post) throw notFound()

    const payload = {
        body: body ?? post.body,
        commenting: commenting ?? post.commenting,
        audience: audience ?? post.audience,
        photo: photo ?? post.photo,
        creator: creator ?? post.creator
    }

    await post.overwrite(payload).save()

    return post
}


module.exports = {
    createPost,
    deletePost,
    findSinglePost,
    findAllPost,
    updateOrCreatePost,
    updatePost,
    countPost,
    checkOwnership
}