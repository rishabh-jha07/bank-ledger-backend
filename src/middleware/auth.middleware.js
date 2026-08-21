const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const BlacklistToken = require("../models/blackList.model")

async function authMiddleware(req, res, next) {
    const authorizationHeader = req.headers.authorization
    const bearerToken = authorizationHeader?.startsWith("Bearer ")
        ? authorizationHeader.slice(7).trim()
        : authorizationHeader?.trim()

    const cookieToken = req.cookies.token?.trim()
    const token = cookieToken || bearerToken

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access, token is missing"
        })
    }

    const cleanToken = token.replace(/^"|"$/g, "")

    const isBlacklisted = await BlacklistToken.findOne({ token: cleanToken })
    if (isBlacklisted) {
        return res.status(401).json({
            message: "Unauthorized access, token is blacklisted"
        })
    }

    try {
        const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET)

        const user = await userModel.findById(decoded.userId)

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized access, user not found"
            })
        }

        req.user = user
        return next()
    } catch (err) {
        let message = "Unauthorized access, token is invalid"

        if (err.name === "TokenExpiredError") {
            message = "Unauthorized access, token has expired"
        } else if (err.name === "JsonWebTokenError") {
            message = "Unauthorized access, token is malformed or signed with the wrong secret"
        }

        return res.status(401).json({
            message
        })
    }
}

async function authSystemUserMiddleware(req, res, next) {
    const authorizationHeader = req.headers.authorization
    const bearerToken = authorizationHeader?.startsWith("Bearer ")
        ? authorizationHeader.slice(7).trim()
        : authorizationHeader?.trim()

    const cookieToken = req.cookies.token?.trim()
    const token = cookieToken || bearerToken

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access, token is missing"
        })
    }

    const cleanToken = token.replace(/^"|"$/g, "")

    const isBlacklisted = await BlacklistToken.findOne({ token: cleanToken })
    if (isBlacklisted) {
        return res.status(401).json({
            message: "Unauthorized access, token is blacklisted"
        })
    }

    try {
        const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET)

        const user = await userModel.findById(decoded.userId).select("+systemUser")

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized access, user not found"
            })
        }

        if (!user.systemUser) {
            return res.status(403).json({
                message: "Forbidden access, user is not a system user"
            })
        }

        req.user = user
        return next()
    } catch (err) {
        let message = "Unauthorized access, token is invalid"

        if (err.name === "TokenExpiredError") {
            message = "Unauthorized access, token has expired"
        } else if (err.name === "JsonWebTokenError") {
            message = "Unauthorized access, token is malformed or signed with the wrong secret"
        }

        return res.status(401).json({
            message
        })
    }
}

module.exports = {
    authMiddleware,
    authSystemUserMiddleware
}
