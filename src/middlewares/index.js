const morgan = require('morgan')

/**
 * @param {Express} app 
 */
module.exports = function setupMiddlewares(app) {
    app.use([
        morgan('dev'),
        require('express').json(),
    ])
}