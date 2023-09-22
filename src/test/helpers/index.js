const { faker } = require('@faker-js/faker')
const { createUser } = require('../../lib/user')
const { createPost } = require('../../lib/post')
const { createComment } = require('../../lib/comment')
const { Comment } = require('../../models')

const getFakeUserCreationData = () => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    bio: faker.lorem.paragraph()
})

const createRandomUser = async () => {
    const data = getFakeUserCreationData()

    const user = await createUser(data)

    return { data, user }
}

const createRandomPost = async ({ commenting, audience, creator = '6506d176b40d591e4fddb5e4' }) => {
    const data = {
        body: faker.lorem.paragraph(),
        creator,
        audience,
        commenting,
    }

    const post = await createPost({ ...data })

    return { data, post }
}

const createRandomComment = async (data) => {
    const { post } = await createRandomPost({})

    data = {
        body: data?.body ?? faker.lorem.sentence(),
        post: data?.post ?? post.id,
        commentor: data?.commentor ?? '6506d176b40d591e4fddb5e4',
        status: data?.status ?? 'public'
    }

    const comment = await Comment.create(data)

    return { data, comment }
}

module.exports = {
    getFakeUserCreationData,
    createRandomUser,
    createRandomPost,
    createRandomComment
}