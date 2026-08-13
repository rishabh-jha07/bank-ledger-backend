const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const { sendRegisterationEmail } = require("../services/email.service")


/** 
 * - User register controller 
 * - POST /api/auth/register 
 */

async function userRegisterController(req, res) {
  try {
    const { email, password, name } = req.body
    const normalizedEmail = email?.trim().toLowerCase()
    const normalizedPassword = password?.trim()
    const normalizedName = name?.trim()

    const isExists = await userModel.findOne({ email: normalizedEmail })

    if (isExists) {
      return res.status(422).json({
        message: "User already exists with email.",
        status: "failed"
      })
    }

    const user = await userModel.create({
      email: normalizedEmail,
      password: normalizedPassword,
      name: normalizedName,
      systemUser: false
    })

    await sendRegisterationEmail(user.email, user.name)

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })

    res.cookie("token", token)

    res.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name

      },
      token
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "failed"
    })
  }
}

/**
 * - User login controller
 * - POST /api/auth/login
 */

async function userLoginController(req,res) {
  try {
    const { email, password } = req.body
    const normalizedEmail = email?.trim().toLowerCase()
    const normalizedPassword = password?.trim()

    if (!normalizedEmail || !normalizedPassword) {
      return res.status(400).json({
        message: "Email and password are required"
      })
    }

    const user = await userModel.findOne({ email: normalizedEmail }).select("+password")

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      })
    }

    if (!user.password) {
      return res.status(500).json({
        message: "Stored password is missing for this user"
      })
    }

    const isValidPassword = await user.comparePassword(normalizedPassword)

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Password is invalid"
      })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })

    res.cookie("token", token)

    res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name

      },
      token
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "failed"
    })
  }

  

}

module.exports = {
    userRegisterController,
    userLoginController
}