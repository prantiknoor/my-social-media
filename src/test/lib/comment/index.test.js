const mongoose = require('mongoose')
const { connectDB } = require('../../../db')
const { notFound } = require('../../../utils/httpErrors')
const { faker } = require('@faker-js/faker')
const { createRandomPost, createRandomUser, createRandomComment } = require('../../helpers')
const { createComment, deleteComment, findSingleComment, findAllComment, updateOrCreateComment, updateComment } = require('../../../lib/comment')
const { Comment } = require('../../../models')


beforeAll(async () => {
    await connectDB(true)
})

afterAll(async () => {
    await mongoose.connection.close(true)
})

describe('Comment', () => {
    let user, post
    const randomId = '6506d176b40d591e4fddb5e4'

    beforeAll(async () => {
        user = (await createRandomUser()).user
        post = (await createRandomPost({})).post
    })

    describe('Comment Creation', () => {
        it('should throw notFound error because post doesn\'t exist', () => {
            const data = {
                body: faker.lorem.sentence(),
                post: randomId,
                commentor: user.id
            }

            return expect(createComment(data)).rejects.toThrowError('Post not found')
        })

        it('should create a comment successfully', async () => {
            const data = {
                body: faker.lorem.sentence(),
                post: post.id,
                commentor: user.id
            }

            const comment = await createComment(data)

            expect(comment.body).toBe(data.body)
            expect(comment.commentor.toString()).toBe(data.commentor)
        })

        it('should throw badRequest error for invalid input', () => {
            const bigBody = faker.lorem.paragraph(10)
            const data = {
                body: bigBody,
                post: post.id,
                commentor: user.id
            }
            return expect(createComment(data))
                .rejects.toThrowError(mongoose.MongooseError)
        })
    })

    describe('Comment Deletion', () => {
        it('should throw notFound error', () => {
            return expect(deleteComment(randomId)).rejects.toThrow(notFound())
        })

        it('should delete the comment', async () => {
            const { comment } = await createRandomComment()

            await deleteComment(comment.id);
        })
    })

    describe('Comment Getting', () => {
        describe('Getting single comment', () => {
            it('should throw notFound error', () => {
                return expect(findSingleComment(randomId)).rejects.toThrow(notFound('Comment not found'))
            })

            it('should return a comment successfully', async () => {
                const { comment } = await createRandomComment()

                const foundComment = await findSingleComment(comment.id)

                expect(foundComment.body).toBe(comment.body)
                expect(foundComment.commentor).toStrictEqual(comment.commentor)
                expect(foundComment.post).toStrictEqual(comment.post)
            })
        })

        describe('Getting all comments', () => {
            const totalComments = 5

            beforeAll(async () => {
                await Comment.deleteMany()

                for (let i = 0; i < totalComments; i++) {
                    await createRandomComment()
                }
            })

            it('should do pagination properly', async () => {
                const limit = 2
                const totalPage = Math.ceil(totalComments / limit)
                let commentCount = 0

                for (let page = 1; page <= totalPage; page++) {
                    const comments = await findAllComment({ limit, page })

                    commentCount += comments.length

                    expect(comments.length).not.toBeGreaterThan(limit)
                }

                expect(commentCount).toBe(totalComments)
            })

            it('should return a list of comments with proper sorting (desc)', async () => {
                const limit = 2;
                const comments = await findAllComment({ limit, sortBy: 'updatedAt', sortType: 'desc' })

                let prevUpdatedAt = new Date(comments[0].updatedAt).getTime()

                for (const comment of comments) {
                    const currUpdatedAt = new Date(comment.updatedAt).getTime()

                    expect(currUpdatedAt).toBeLessThanOrEqual(prevUpdatedAt)

                    prevUpdatedAt = currUpdatedAt
                }
            })

            it('should return a list of comments with proper sorting (asc)', async () => {
                const limit = 3;
                const comments = await findAllComment({ limit, sortBy: 'createdAt', sortType: 'asc' })

                let prevUpdatedAt = new Date(comments[0].updatedAt).getTime()

                for (const comment of comments) {
                    const currUpdatedAt = new Date(comment.updatedAt).getTime()

                    expect(currUpdatedAt).toBeGreaterThanOrEqual(prevUpdatedAt)

                    prevUpdatedAt = currUpdatedAt
                }
            })
        })
    })

    describe('Comment Updating', () => {
        describe('Fully update or create (PUT)', () => {
            it('should update comment and return 200 code', async () => {
                const { comment } = await createRandomComment()
                const newData = {
                    ...comment._doc,
                    body: faker.lorem.sentence(),
                }

                const { comment: updatedComment, code } = await updateOrCreateComment(comment.id, { ...newData })

                expect(code).toBe(200)

                expect(updatedComment.body).toBe(newData.body)
            })

            it('should not find comment then create a new comment', async () => {
                const data = { body: faker.lorem.sentence(), post: post.id, commentor: user.id }

                const { comment, code } = await updateOrCreateComment(randomId, { ...data })

                expect(code).toBe(201)

                expect(comment.body).toBe(data.body)
            })
        })

        describe('Partially update a comment (PATCH)', () => {
            beforeAll(async () => await Comment.deleteMany())

            it('should throw notFound error', async () => {
                const data = { body: faker.lorem.sentence() }

                return expect(updateComment(randomId, { ...data })).rejects.toThrow(notFound())
            })

            it('should update comment', async () => {
                const { comment } = await createRandomComment({})
                const body = faker.lorem.sentence()
                const status = 'hidden'

                const updatedComment = await updateComment(comment.id, { body, status })

                expect(updatedComment.body).toBe(body)
                expect(updatedComment.status).toBe(status)
            })
        })
    })
})