// Import the required modules
const express = require("express")
const router = express.Router()

const { capturePayment, verifySignature } = require("../controllers/Payment")
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth.middleware")
router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verifySignature",auth, isStudent, verifySignature)

module.exports = router