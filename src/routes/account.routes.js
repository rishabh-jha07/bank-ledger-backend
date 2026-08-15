const express = require('express')
const { authMiddleware } = require("../middleware/auth.middleware")
const { createAccountContoller, getUserAccountsController, getAccountBalanceController } = require("../controllers/account.controller")

const router = express.Router()

/**
 * - POST /api/account
 * - POST /api/accounts
 * - Create a new account
 * - Protected Route
 */

router.post("/", authMiddleware, createAccountContoller)

/**
 * - GET /api/account
 * - GET /api/accounts
 * - Get all accounts of the logged-in user
 * - Protected Route
 */

router.get("/", authMiddleware, getUserAccountsController)

/**
 * - GET /api/accounts/balance/:accountId
 * - GET /api/account/balance/:accountId
 * - Get account balance by accountId
 * - Protected Route
 */

router.get("/balance/:accountId", authMiddleware, getAccountBalanceController)

module.exports = router