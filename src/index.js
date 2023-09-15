const app = require('./app')
const { createServer } = require('node:http')
const { connectDB } = require('./db')

const server = createServer(app)

const port = process.env.PORT || 3000

const main = async () => {
    try {
        await connectDB();
        server.listen(port, () => {
            console.log('Server listening on port:', port);
        })
    } catch (error) {
        console.log(error);
    }
}

main()