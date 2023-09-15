const express = require('express')
const setupMiddlewares = require('./middlewares')
const router = require('./routes')
const { createUser } = require('./lib/user')

const app = express()

setupMiddlewares(app)

app.use(router)

app.use((err, _req, res, _next) => {
    const statusCode = err.status || 500
    
    res.status(statusCode).json({
        status: statusCode,
        message: err.message,
        errors: err.errors
    })

    console.log(err);
})

app.get('/health', (_req, res) => {
    res.json({
        code: 200,
        message: 'OK'
    })
})

app.get('/', async (req, res) => {
    const data = {
        name: 'Prantik',
        email: 'prantik@gmail.com',
        password: 'abc123;'
    }

    const user = await createUser(data)

    console.log(user);

    res.json(user)
})

module.exports = app