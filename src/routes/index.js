const { controllers: userControllers } = require('../api/v1/user')
const { controllers: postControllers } = require('../api/v1/post')
const { controllers: authControllers } = require('../api/v1/auth')
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
        ownership('Post'),
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

module.exports = router