const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllerAdmin");

router.post("/register", authController.registerAdmin);
router.post("/login", authController.loginAdmin);

module.exports = router;
