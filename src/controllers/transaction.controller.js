const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/ledger.model")
const accountModel = require("../models/account.model")
const emailService = require("../services/email.service")
const mongoose = require("mongoose")

/**
    * - Create a new transaction
    * The 10-STEP TRANSFER FLOW:
    * 1. Validate request
    * 2. Validate idempotency key
    * 3. Check account status
    * 4. Drive sender balance from ledger
    * 5. Create transaction (PENDING)
    * 6. Create DEBIT ledger entry 
    * 7. Create CREDIT ledger entry
    * 8. Mark transaction as COMPLETED
    * 9. Commit MongoDB session
    * 10. Send email notification 

*/
async function createTransaction(req, res) {
    try {
        /**
         * - 1. Validate request
         */
        
        const { fromAccount, toAccount, amount, idempotencyKey } = req.body

        if(!fromAccount || !toAccount || !amount || !idempotencyKey) {
            return res.status(400).json({
                message: "FromAccount, toAccount, amount and idempotencyKey are required"
            })
        }

        const fromUserAccount = await accountModel.findOne({ 
            _id: fromAccount,
        })

        const toUserAccount = await accountModel.findOne({
            _id: toAccount,
        })

        if(!fromUserAccount || !toUserAccount) {
            return res.status(404).json({
                message: "Invalid fromAccount or toAccount"
            })
        }

        /**
         * 2. Validate idempotency key
         */

        const isTransactionExists = await transactionModel.findOne({
            idempotencyKey: idempotencyKey
        })

        if(isTransactionExists) {
            if(isTransactionExists.status === "COMPLETED") {
                return res.status(200).json({
                    message: "Transaction already completed",
                    transaction: isTransactionExists
                })
            }

            if(isTransactionExists.status === "PENDING") {
                return res.status(200).json({
                    message: "Transaction is already in progress",
                })
            }

            if(isTransactionExists.status === "FAILED") {
                return res.status(500).json({
                    message: "Transaction has failed previously",
                })
            }

            if(isTransactionExists.status === "REVERSED") {
                return res.status(500).json({
                    message: "Transaction has been reversed previously",
                })
            }
        }

        /**
         * 3. Check account status
         */

        if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
            return res.status(400).json({
                message: "Both accounts must be ACTIVE to perform a transaction"
            })
        }

        /**
         * 4. Drive sender balance from ledger
         */

        const balance = await fromUserAccount.getBalance()

        if(balance < amount) {
            return res.status(400).json({
                message: `Insufficient balance. Current balance is ${balance}. Requested amount is ${amount}.`
            })
        }

        /**
         * 5. Create transaction (PENDING)
         */

        const session = await mongoose.startSession()
        session.startTransaction()

        let transaction;

        try {
            const createdTx = await transactionModel.create([{
                fromAccount,
                toAccount,
                amount,
                idempotencyKey,
                status: "PENDING"
            }], { session })
            transaction = createdTx[0]

            await ledgerModel.create([{
                account: fromAccount,
                amount: amount,
                transaction: transaction._id,
                type: "DEBIT",
            }], { session })

            await ledgerModel.create([{
                account: toAccount,
                amount: amount,
                transaction: transaction._id,
                type: "CREDIT",
            }], { session })

            transaction.status = "COMPLETED"
            await transaction.save({ session })

            await session.commitTransaction()
            session.endSession()
        } catch (sessionErr) {
            await session.abortTransaction()
            session.endSession()
            throw sessionErr
        }

        /** 
         * 10. Send email notification
         */
        try {
            if (req.user && req.user.email) {
                await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount)
            }
        } catch (emailErr) {
            console.error("Failed to send transaction email:", emailErr.message)
        }

        return res.status(201).json({
            message: "Transaction completed successfully",
            transaction
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message || "Internal server error"
        })
    }
}

async function createInitialFundsTransaction(req, res) {
    try {
        const {toAccount, amount, idempotencyKey} = req.body

        if(!toAccount || !amount || !idempotencyKey) {
            return res.status(400).json({
                message: "toAccount, amount and idempotencyKey are required"
            })
        }

        const isTransactionExists = await transactionModel.findOne({
            idempotencyKey: idempotencyKey
        })

        if(isTransactionExists) {
            if(isTransactionExists.status === "COMPLETED") {
                return res.status(200).json({
                    message: "Transaction already completed",
                    transaction: isTransactionExists
                })
            }

            if(isTransactionExists.status === "PENDING") {
                return res.status(200).json({
                    message: "Transaction is already in progress",
                })
            }

            if(isTransactionExists.status === "FAILED") {
                return res.status(500).json({
                    message: "Transaction has failed previously",
                })
            }

            if(isTransactionExists.status === "REVERSED") {
                return res.status(500).json({
                    message: "Transaction has been reversed previously",
                })
            }
        }

        const toUserAccount = await accountModel.findOne({
            _id: toAccount,
        })

        if(!toUserAccount) {
            return res.status(404).json({
                message: "Invalid toAccount"
            })
        }

        const fromUserAccount = await accountModel.findOne({
            user: req.user._id
        })

        if(!fromUserAccount) {
            return res.status(404).json({
                message: "System user account not found"
            })
        }

        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            const transaction = new transactionModel({
                fromAccount: fromUserAccount._id,
                toAccount,
                amount,
                idempotencyKey,
                status: "PENDING"
            })

            await ledgerModel.create([{
                account: fromUserAccount._id,
                amount: amount,
                transaction: transaction._id,
                type: "DEBIT",
            }], { session })

            await ledgerModel.create([{
                account: toAccount,
                amount: amount,
                transaction: transaction._id,
                type: "CREDIT",
            }], { session })

            transaction.status = "COMPLETED"
            await transaction.save({ session })

            await session.commitTransaction()
            session.endSession()

            return res.status(201).json({
                message: "Initial funds transaction completed successfully",
                transaction
            })
        } catch (err) {
            await session.abortTransaction()
            session.endSession()
            throw err
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message || "Internal server error"
        })
    }
}

module.exports = {
    createTransaction,
    createInitialFundsTransaction
}

    
    



