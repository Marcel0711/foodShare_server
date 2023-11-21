require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')

const userRouter = require('./routes/User')
const recipeRouter = require('./routes/Recipe')

const app = express()

//middleware
app.use(bodyParser.json())
app.use(cors())

//routes
app.use('/users', userRouter)
app.use('/recipes', recipeRouter)

//connection
mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(process.env.PORT, () => {
        console.log('connected to db')
    })
}).catch((error) => {
    console.log(error)
})
