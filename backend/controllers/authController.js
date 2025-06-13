import jwt from "jsonwebtoken"
import db from "../lib/db.js"
import bcrypt from "bcryptjs"

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, profileImageUrl, bio, adminAccessToken } =
      req.body

    const userExists = await db.user.findUnique({ where: { email } })
    if (userExists) {
      return res.status(400).json({ message: "User already exists!" })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    let role = "MEMBER"
    if (
      adminAccessToken &&
      adminAccessToken == process.env.ADMIN_ACCESS_TOKEN
    ) {
      role = "ADMIN"
    }

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        profileImageUrl,
        bio,
        role,
      },
    })

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      bio: user.bio,
      role,
      token: generateToken(user.id),
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await db.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(500).json({ message: "Invalid email or password" })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(500).json({ message: "Invalid email or password" })
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      bio: user.bio,
      role: user.role,
      token: generateToken(user.id),
    })
    //
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const getUserProfile = async (req, res) => {
  try {
    const user = await db.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        profileImageUrl: true,
        bio: true,
        role: true,
      },
    })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
    //
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
