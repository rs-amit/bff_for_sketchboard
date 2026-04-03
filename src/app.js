import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"

import authRoutes from "./routes/auth.routes.js"
import { errorHandler } from "./middlewares/errorhandler.middleware.js"

const app = express()

app.use(cors())
app.use(helmet())
app.use(morgan("dev"))

app.use(express.json())

app.use("/api/auth", authRoutes)

app.use(errorHandler)

export default app