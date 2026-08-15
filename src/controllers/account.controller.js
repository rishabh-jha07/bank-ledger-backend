const accountModel = require("../models/account.model")
const mongoose = require("mongoose")

async function createAccountContoller(req, res){

    const user = req.user;

    if(!user){
        return res.status(401).json({
            message: "Unauthorized access, user is missing"
        })
    }

    const { currency = "INR", status = "ACTIVE" } = req.body || {}

    const account = await accountModel.create({
        user:user._id,
        currency,
        status
    })

    res.status(201).json({
        account
    })

}

async function getUserAccountsController(req, res) {
    const user = req.user

    if (!user) {
        return res.status(401).json({
            message: "Unauthorized access, user is missing"
        })
    }

    const accounts = await accountModel.find({ user: user._id })

    return res.status(200).json({
        accounts
    })
}

async function getAccountBalanceController(req, res) {
    try {
        const accountId = req.params.accountId ? req.params.accountId.trim() : ""

        if (!mongoose.Types.ObjectId.isValid(accountId)) {
            return res.status(400).json({
                message: "Invalid account ID format"
            })
        }

        const account = await accountModel.findOne({
            _id: accountId,
            user: req.user._id
        })

        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            })   
        }

        const balance = await account.getBalance();

        return res.status(200).json({
            accountId: account._id,
            balance: balance
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message || "Internal server error"
        })
    }
}

module.exports = {
    createAccountContoller,
    getUserAccountsController,
    getAccountBalanceController
}