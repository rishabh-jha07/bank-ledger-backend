const express = require("express")
const { userRegisterController, userLoginController } = require("../controllers/auth.controller")
const { authMiddleware } = require("../middleware/auth.middleware")

const router = express.Router()

/*POST /api/auth/register */
router.post("/register", userRegisterController)

/* POST /api/auth/login */
router.post("/login", userLoginController)

/* GET /api/auth/verify */
router.get("/verify", authMiddleware, (req, res) => {
	return res.status(200).json({
		message: "User verified successfully",
		user: req.user
	})
})

module.exports = router