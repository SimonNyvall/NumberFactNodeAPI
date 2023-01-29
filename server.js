const http = require("http")
const mongoose = require("mongoose")
mongoose.set('strictQuery', false);
//const numberFactSchema = require('../ExpressApi/models/numberFact-model')
const numberFactSchema = require(__dirname + '/models/numberFact-model')

const express = require("express");
const { read } = require("fs");
const { json } = require("express");
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
db.once('open', () => console.log('Connected to database'))

app.use(express.json())

app.use(express.static(__dirname + '/public'))

const PORT = process.env.PORT || 3000

app.get("/Keys", (req, res) => res.send(process.env))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})

app.get("/ShowAllFacts", async (req, res) => {
    try {
        const numberFacts = await numberFactSchema.find()
        res.json(numberFacts)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

app.get("/GetFactById/:id", getNumberFact, async (req, res) => {
    res.json(res.numberFact)
})

app.post("/AddFact", async (req, res) => {    
    const body = req.body

    if (!isJsonKeysCorrect(body)) {
        return res.send("The object is not of the right structure")
    }

    if (isIdOccupied(body)) {
        return res.send("That id is not available try: " + numberFacts.length)
    }

    const numberFactPost = new numberFactSchema({
        number: req.body.number,
        factMessage: req.body.factMessage
    })

    try {
        const newNumberFact = await numberFactPost.save()
        res.status(201).json(newNumberFact)
    }
    catch (err) {
        res.status(400).json({ message: err.message})
    }
})

function isJsonKeysCorrect(json) {
    if (!("id" in json)) return false

    if (!("number" in json)) return false

    if (!("factMessage" in json)) return false

    return true
}

app.post( "/AddRandomFact",  (req, res) => {
    let newNumberFact

    http.get("http://numbersapi.com/random/math",  (response) => {
        response.on('data', async (dataMessage) => {

            const subStringNumber = getSubStringNumber(dataMessage)

            const numberFactPost = new numberFactSchema({
                number: subStringNumber,
                factMessage: String(dataMessage)
            })

            try {
                newNumberFact = await numberFactPost.save()
            }
            catch (err) {
                res.status(400).json({ message: err.message})
            }

        })
    }).on('error', (err) => {
        console.log(err.message)
        res.status(400).send()
    })

    res.json({ message: 'Added ranom instance of numberFact' })
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

app.put("/UpdateFact/:id", getNumberFact, async (req, res) => {
    const body = req.body

    if (!isJsonKeysCorrect(body)) {
        res.status(400).json({ message: 'Invalid onject' })
    }

    res.numberFact.id = body.id
    res.numberFact.number = body.number
    res.numberFact.factMessage = body.factMessage

    try {
        const updatedNumberFact = await res.numberFact.save()
        res.json(updatedNumberFact)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

app.delete("/DeleteFactById/:id", getNumberFact, async (req, res) => {
   try {
    await res.numberFact.remove()
    res.json({ message: 'Removed numberFact' })
   } catch (error) {
    res.status(500).json({ message: error.message })
   }
   
})

async function getNumberFact(req, res, next) {
    let numberFact

    try {
        numberFact = await numberFactSchema.findById(req.params.id)

        if (numberFact == null) {
            return res.status(404).json({ message: "Not found" })
        }

    } catch (error) {
        res.status(500).json({ message: err.message })
    }

    res.numberFact = numberFact
    next()
}

app.listen(PORT, () =>{
    console.log("Listening on port " + PORT)
})