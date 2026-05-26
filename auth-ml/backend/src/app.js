import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

// Routes import
import userRouter from './routes/user.routes.js'
import { globalLimiter } from "./middlewares/rateLimitter.middlewares.js"
import { errorHandler } from "./middlewares/errorHandler.middlewares.js"

app.use(globalLimiter)
app.use("/api/v1/users", userRouter)


app.use(errorHandler)

export { app }