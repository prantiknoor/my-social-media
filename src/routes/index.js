const { controllers: userControllers } = require('../api/v1/user')
const { controllers: postControllers } = require('../api/v1/post')
const { controllers: authControllers } = require('../api/v1/auth')
const { controllers: likeControllers } = require('../api/v1/like')
const { controllers: followControllers } = require('../api/v1/follow')
const { controllers: commentControllers } = require('../api/v1/comment')
const { authenticate, authorize, ownership } = require('../middlewares')

const router = require('express').Router()

router.route('/api/v1/users')
    .get(userControllers.findAll)
    .post(authenticate, authorize(), userControllers.create)

router.route('/api/v1/users/:id')
    .get(userControllers.findSingle)
    .delete(authenticate, authorize(), userControllers.deleteSingle)
    .put(
        authenticate,
        authorize(['admin', 'user']),
        ownership('User'),
        userControllers.update
    )
    .patch(
        authenticate,
        authorize(['admin', 'user']),
        ownership('User'),
        userControllers.updatePartially
    )

router.route('/api/v1/posts')
    .get(postControllers.findAll)
    .post(
        authenticate,
        authorize(['admin', 'user']),
        postControllers.create
    )

router.route('/api/v1/posts/:id')
    .get(postControllers.findSingle)
    .delete(
        authenticate,
        authorize(['admin', 'user']),
        ownership('Post'),
        postControllers.deleteSingle
    )
    .put(
        authenticate,
        authorize(['admin', 'user']),
        ownership('Post'),
        postControllers.update
    )
    .patch(
        authenticate,
        authorize(['admin', 'user']),
        ownership('Post'),
        postControllers.updatePartially
    )

router.route('/api/v1/auth/register')
    .post(authControllers.register)
router.route('/api/v1/auth/login')
    .post(authControllers.login)

router.route('/api/v1/posts/:id/likes')
    .get(likeControllers.findLikesOfPost)
    .post(
        authenticate,
        authorize(['admin', 'user']),
        likeControllers.likePost
    )
    .delete(
        authenticate,
        authorize(['admin', 'user']),
        likeControllers.deleteLike
    )

router.route('/api/v1/users/:id/followers')
    .get(followControllers.findAllFollowers)

router.route('/api/v1/users/:id/followees')
    .get(followControllers.findAllFollowees)

router.route('/api/v1/users/:id/follow')
    .post(
        authenticate,
        authorize(['admin', 'user']),
        followControllers.follow
    )

router.route('/api/v1/users/:id/unfollow')
    .post(
        authenticate,
        authorize(['admin', 'user']),
        followControllers.unfollow
    )

router.route('/api/v1/posts/:id/comments')
    .get(commentControllers.findAll)
    .post(
        authenticate,
        authorize(['admin', 'user']),
        commentControllers.create
    )

router.route('/api/v1/comments')
    .get(commentControllers.findAll)

router.route('/api/v1/comments/:id')
    .get(commentControllers.findSingle)
    .delete(
        authenticate,
        authorize(['admin', 'user']),
        ownership('Comment'),
        commentControllers.deleteSingle
    )
    .patch(
        authenticate,
        authorize(['admin', 'user']),
        ownership('Comment'),
        commentControllers.updatePartially
    )


module.exports = router