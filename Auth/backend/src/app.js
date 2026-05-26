import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import client from "prom-client"
import { metricsMiddleware } from "./middlewares/metric.middlewares.js"

const app = express()

// Enable Prometheus metrics collection
client.collectDefaultMetrics()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())
app.use(metricsMiddleware) // Add metrics middleware

// Routes import
import userRouter from './routes/user.routes.js'
import { globalLimiter } from "./middlewares/rateLimitter.middlewares.js"
import { errorHandler } from "./middlewares/errorHandler.middlewares.js"

app.use(globalLimiter)
// Routes declaration
app.use("/api/v1/users", userRouter)

// Metrics endpoint
app.get("/metrics", async (req, res) => {
    res.set('Content-Type', client.register.contentType)
    res.end(await client.register.metrics())
})

app.use(errorHandler)

export { app }