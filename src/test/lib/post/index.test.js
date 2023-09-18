const mongoose = require('mongoose')
const { connectDB } = require('../../../db')
const { faker } = require('@faker-js/faker')
const { createRandomUser, createRandomPost } = require('../../helpers')
const { createPost, deletePost, findSinglePost, findAllPost, updateOrCreatePost, updatePost } = require('../../../lib/post')
const { notFound } = require('../../../utils/httpErrors')
const { Post } = require('../../../models')


beforeAll(async () => {
    await connectDB(true)
})

afterAll(async () => {
    await mongoose.connection.close(true)
})

describe('Post', () => {
    let user, randomPostId = '6506d176b40d591e4fddb5e4'

    beforeAll(async () => {
        user = await createRandomUser()
    })

    describe('Post Creation', () => {
        it('should create a post successfully', async () => {
            const body = faker.lorem.paragraph()

            const post = await createPost({ creator: user.id, body })

            expect(post.body).toBe(body)
            expect(post.creator).toBe(user.id)
        })
        it('should throw badRequest error for invalid input', () => {
            const bigBody = faker.lorem.paragraph(10)
            return expect(createPost({ creator: user.id, body: bigBody }))
                .rejects.toThrowError(mongoose.MongooseError)
        })
    })
    describe('Post Deletion', () => {
        it('should throw notFound error', () => {
            return expect(deletePost(randomPostId)).rejects.toThrowError('Post not found')
        })
        it('should delete a post', async () => {
            const { post } = await createRandomPost({})

            await deletePost(post.id);
        })
    })
    describe('Post Getting', () => {
        describe('Getting single post', () => {
            it('should throw notFound error', () => {
                return expect(findSinglePost(randomPostId)).rejects.toThrow(notFound('Post not found'))
            })
            it('should return a post successfully with like and comment count', async () => {
                const { post } = await createRandomPost({})

                const foundPost = await findSinglePost(post.id)

                expect(foundPost.body).toBe(post.body)
                expect(foundPost.creator).toStrictEqual(post.creator)

                expect(foundPost.likes).toBe(0)
                expect(foundPost.comments).toBe(0)
            })
        })
        describe('Getting all posts', () => {
            const totalPosts = 5

            beforeAll(async () => {
                await Post.deleteMany()

                for (let i = 0; i < totalPosts; i++) {
                    await createRandomPost({})
                }
            })

            it('should do pagination properly', async () => {
                const limit = 2
                const totalPage = Math.ceil(totalPosts / limit)
                let postCount = 0

                for (let page = 1; page <= totalPage; page++) {
                    const posts = await findAllPost({ limit, page })

                    postCount += posts.length

                    expect(posts.length).not.toBeGreaterThan(limit)
                }

                expect(postCount).toBe(totalPosts)
            })

            it('should return a list of posts with proper sorting (desc)', async () => {
                const limit = 2;
                const posts = await findAllPost({ limit, sortBy: 'updatedAt', sortType: 'desc' })

                let prevUpdatedAt = new Date(posts[0].updatedAt).getTime()

                for (const post of posts) {
                    const currUpdatedAt = new Date(post.updatedAt).getTime()

                    expect(currUpdatedAt).toBeLessThanOrEqual(prevUpdatedAt)

                    prevUpdatedAt = currUpdatedAt
                }
            })

            it('should return a list of posts with proper sorting (asc)', async () => {
                const limit = 3;
                const posts = await findAllPost({ limit, sortBy: 'createdAt', sortType: 'asc' })

                let prevUpdatedAt = new Date(posts[0].updatedAt).getTime()

                for (const post of posts) {
                    const currUpdatedAt = new Date(post.updatedAt).getTime()

                    expect(currUpdatedAt).toBeGreaterThanOrEqual(prevUpdatedAt)

                    prevUpdatedAt = currUpdatedAt
                }
            })
        })
    })
    describe('Post Updating', () => {
        describe('Fully update or create (PUT)', () => {
            it('should update post and return 200 code', async () => {
                const { post } = await createRandomPost({})
                const newData = {
                    ...post,
                    body: faker.lorem.paragraph(),
                    audience: 'public'
                }

                const { post: updatedPost, code } = await updateOrCreatePost(post.id, { ...newData })

                expect(code).toBe(200)

                expect(updatedPost.body).toBe(newData.body)
                expect(updatedPost.audience).toBe(newData.audience)
            })

            it('should not find user then create a new user', async () => {
                const data = { body: faker.lorem.paragraph() }

                const { post, code } = await updateOrCreatePost(randomPostId, { ...data })

                expect(code).toBe(201)

                expect(post.body).toBe(data.body)
            })
        })

        describe('Partially update a post (PATCH)', () => {
            beforeAll(async () => await Post.deleteMany())

            it('should throw notFound error', async () => {
                const data = { body: faker.lorem.paragraph() }

                return expect(updatePost(randomPostId, { ...data })).rejects.toThrow(notFound())
            })

            it('should update user', async () => {
                const { post } = await createRandomPost({})
                const body = faker.lorem.paragraph()
                const audience = 'only_me'

                const updatedPost = await updatePost(post.id, { body, audience })

                expect(updatedPost.body).toBe(body)
                expect(updatedPost.audience).toBe(audience)
            })
        })
    })
})