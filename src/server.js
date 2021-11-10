import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
//
const corsConfig = {
    credentials: true,
    origin: true,
};
//
import userRouter from './routes/user.js'
import postRouter from './routes/post.js'
import commentsRouter from './routes/commentsRouter.js'
import notifyRouter from './routes/notifyRouter.js'
import messageRouter from './routes/messageRouter.js'
//app config
const app = express()
app.use(express.json())
app.use(cors(corsConfig))
app.use(cookieParser())
//Socket...
import { createServer } from "http";
import { Server } from "socket.io";
import { socketServer } from './socketServer.js'
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: true,
        methods: ["POST", "GET"],
    }
});

io.on("connection", (socket) => {
    socketServer(socket)
});

//Socket...

//db config
const url = process.env.MONGO_URL
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if (err) console.log(err.message);
    else
        console.log('Connected to mongodb')
})
//routes...
app.use('/api', userRouter)
app.use('/api', postRouter)
app.use('/api', commentsRouter)
app.use('/api', notifyRouter)
app.use('/api', messageRouter)
//listener
const PORT = process.env.PORT
httpServer.listen(PORT, () => {
    console.log(`server is running at ${PORT}`)
})
