require('dotenv').config()
require('express-async-errors')
const port = process.env.PORT || 3000
const express = require('express')
const cookieParser = require('cookie-parser')
const connectDB = require('./helpers/connectDB')
const errorHandler = require('./middleware/error-handler')
const notFound = require('./middleware/not-found')
const authRouter = require('./routes/authRoutes')
const authentication = require('./middleware/auth')
const checkUser = require('./middleware/check-user')

const app = express()

// middleware
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs')

app.get('*', checkUser)
app.get('/', (req, res) => res.render('home'))
app.get('/about', authentication, (req, res) => res.render('about'))
app.use(authRouter)
app.use(notFound)
app.use(errorHandler)

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server on port ${port}`))
        
    } catch (error) {
        console.log(error, 'No se pudo conectar al servidor')
    }
}

start()