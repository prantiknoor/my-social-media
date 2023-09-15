class HttpError extends Error {
    constructor(status, message) {
        super(message)
        this.status = status
    }
}

const notFound = (msg = 'Resource not found') => new HttpError(404, msg)
const serverError = (msg = 'Something went wrong!') => new HttpError(500, msg)
const badRequest = (msg = 'Bad Request') => new HttpError(400, msg)
const authenticationError = (msg = 'Authentication Failed') => new HttpError(401, msg)
const authorizationError = (msg = 'Permission Denied') => new HttpError(403, msg)

module.exports = {
    HttpError,
    notFound,
    serverError,
    badRequest,
    authenticationError,
    authorizationError,
}