const morgan = require('morgan')
const OpenApiValidator = require("express-openapi-validator")

/**
 * @param {Express} app 
 */
function setupMiddlewares(app) {
    app.use([
        morgan('dev'),
        require('express').json(),
    ])
    app.use(OpenApiValidator.middleware({
        apiSpec: './my-social-media.yaml'
    }))
}

module.exports = {
    setupMiddlewares,
    authorize: require('./authorize'),
    authenticate: require('./authenticate'),
    ownership: require('./ownership'),
}