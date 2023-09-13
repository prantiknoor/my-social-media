const app = require('./app')
const { createServer } = require('node:http')

const server = createServer(app)

const port = process.env.PORT || 3010

server.listen(port, () => {
    console.log('Server listening on port:', port);
})

createServer()