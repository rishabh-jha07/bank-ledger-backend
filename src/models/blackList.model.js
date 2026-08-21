const mongoose = require("mongoose")

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required"],
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 259200 // 3 days in seconds
    }
})

const BlacklistToken = mongoose.model("BlacklistToken", blacklistTokenSchema)

module.exports = BlacklistToken
