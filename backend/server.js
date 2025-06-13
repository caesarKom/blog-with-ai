import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import path from "path"
const __dirname = path.resolve()

import aiRoutes from "./routes/aiRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import blogPostRoutes from "./routes/blogPostRoutes.js"
import commentRoutes from "./routes/commentRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"

dotenv.config()

const app = express()

app.use(express.json())
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)

app.use("/api/auth", authRoutes)
app.use("/api/posts", blogPostRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/dashboard-summary", dashboardRoutes)
app.use("/api/ai", aiRoutes)

app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}))

const Port = process.env.PORT || 10000
app.listen(Port, () => console.log(`Server running on port: ${Port}`))
