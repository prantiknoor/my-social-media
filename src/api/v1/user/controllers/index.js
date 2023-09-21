const create = require('./create')
const findSingle = require('./findSingle')
const findAll = require('./findAll')
const deleteSingle = require('./deleteSingle')
const update = require('./update')
const updatePartially = require('./updatePartially')

module.exports = {
    create,
    findSingle,
    findAll,
    deleteSingle,
    update,
    updatePartially
}