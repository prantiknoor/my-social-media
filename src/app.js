const express = require('express')
const setupMiddlewares = require('./middlewares')
const router = require('./routes')

const app = express()

setupMiddlewares(app)

app.use(router)

app.use((err, _req, res) => {
    const statusCode = err.status || 500

    res.status(statusCode).json({
        status: statusCode,
        message: err.message,
        errors: err.errors
    })

    console.log(err);
})

app.listen('/health', (_req, res) => {
    res.json({
        code: 200,
        message: 'OK'
    })
})

module.exports = app