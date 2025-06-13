import jwt from "jsonwebtoken"
import db from "../lib/db.js"

export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization

    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1] // Extract token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await db.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, role: true },
      })
      next()
    } else {
      res.status(401).json({ message: "Not authorized, no token" })
    }
  } catch (error) {
    res.status(401).json({ message: "Token failed", error: error.message })
  }
}
