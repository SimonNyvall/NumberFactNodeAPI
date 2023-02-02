const http = require('http')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false);

const numberFactSchema = require(__dirname + '/models/numberFact-model')

const express = require('express');
const { read } = require('fs');
const { json } = require('express');
const app = express()

require('dotenv').config()
const connectionString = process.env.CUSTOMCONNSTR_MONGODB_KEY

async function connectDb() {
    try {
        await mongoose.connect(connectionString)
    }
    catch (error) {
        console.log(error.message)
    }
}
connectDb()

const db = mongoose.connection
db.once('open', () => console.log('Connected to mongoDb database _numberFactCluster_'))

app.use(express.json())

app.use(express.static(__dirname + '/public'))

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.get('/ShowAllFacts', async (req, res) => {
    try {
        const numberFacts = await numberFactSchema.find()
        res.send(numberFacts)
    }
    catch (err) {
        res.status(500).send({ message: err.message })
    }
})

app.get('/GetFactById/:id', getNumberFact, async (req, res) => {
    res.send(res.numberFact)
})

app.post('/AddFact', async (req, res) => {    
    const body = req.body

    const numberFactPost = new numberFactSchema({
        _id: req.body._id,
        number: req.body.number,
        factMessage: req.body.factMessage,
        __v: req.body.__v
    })

    try {
        const newNumberFact = await numberFactPost.save()
        res.status(201).send(newNumberFact)
    }
    catch (err) {
        res.status(400).send({ message: err.message })
    }
})

app.post( '/AddRandomFact',  (req, res) => {
    let newNumberFact

    http.get('http://numbersapi.com/random/math',  (response) => {
        response.on('data', async (dataMessage) => {

            const subStringNumber = getSubStringNumber(dataMessage)

            const numberFactPost = new numberFactSchema({
                number: subStringNumber,
                factMessage: String(dataMessage)
            })

            try {
                newNumberFact = await numberFactPost.save()
            }
            catch (error) {
                res.status(400).send({ message: error.message})
            }

        })
    }).on('error', (error) => {
        console.log(error.message)
        res.status(400).send()
    })

    res.send({ message: 'Added ranom instance of numberFact' })
})


function getSubStringNumber(dataMessage) {
    const charOffset = 48
    let i = 0
    let subString = ""

    while (isDigit(dataMessage[i])) {
        subString += dataMessage[i] - charOffset

        i++
    }

    return subString
}

function isDigit(char) {
    const charOffset = 48

    if (char < charOffset || char > charOffset + 9) return false

    return true
}

app.put('/UpdateFact/:id', getNumberFact, async (req, res) => {
    const body = req.body

    res.numberFact.id = body.id
    res.numberFact.number = body.number
    res.numberFact.factMessage = body.factMessage

    try {
        const updatedNumberFact = await res.numberFact.save()
        res.send(updatedNumberFact)
    }
    catch (error) {
        res.status(400).send({ message: error.message })
    }
})

app.delete('/DeleteFactById/:id', getNumberFact, async (req, res) => {
   try {
    await res.numberFact.remove()
    res.send({ message: 'Removed numberFact' })
   } catch (error) {
    res.status(500).send({ message: error.message })
   }
   
})

async function getNumberFact(req, res, next) {
    let numberFact

    try {
        numberFact = await numberFactSchema.findById(req.params.id)

        if (numberFact == null) {
            return res.status(404).send({ message: 'Not found' })
        }

    } catch (error) {
        res.status(500).send({ message: error.message })
    }

    res.numberFact = numberFact
    next()
}

app.listen(PORT, () =>{
    console.log(`Listening on PORT ${PORT}`)
})