//framework and libraries imports
import express, { Response, Request, NextFunction, ErrorRequestHandler } from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'

//Routes imports
import postRoutes from './routes/postRoutes'
import authRoutes from './routes/authRoutes'
import subRoutes from './routes/subRoutes'
import miscRoutes from './routes/miscRoutes'

//port

let post = process.env.PORT || 4000

//add properties to precess.env from .env file
dotenv.config()

const app = express()

//Mongoose connection
mongoose.connect('mongodb://127.0.0.1:27017/reddit',{ useNewUrlParser: true, useUnifiedTopology: true })


//Cors for our client
app.use(cors({
    origin:process.env.ORIGIN,
    credentials:true,
    optionsSuccessStatus: 200,
}))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(cookieParser())

// handle static files
app.use(express.static('public'))

//Routes
app.use('/auth',authRoutes)
app.use('/post',postRoutes)
app.use('/sub',subRoutes)
app.use('/misc',miscRoutes)

//Error route
app.use('/',(err: {status:number, errors?: Record<string,any>,message?: string},req:Request,res:Response,next:NextFunction) => {
    err.status = err.status || 500
    res.status(err.status).json(err.errors ? err.errors : err.message)
})
//starting server
app.listen(4000,() => {
    console.log('Server is running')
})