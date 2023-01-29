const mongoose = require('mongoose')

const numberFactSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true
    },
    factMessage: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('numberFact', numberFactSchema)