const accountModel = require("../models/account.model")

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

async function getAllAccountsController(req, res) {
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

module.exports = {
    createAccountContoller,
    getAllAccountsController
}