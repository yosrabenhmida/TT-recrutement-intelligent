const express = require("express");
const router = express.Router();
const candidateAuthController = require("../controllers/candidateAuthController");
// const { protect } = require("../middleware/authMiddleware"); // décommente si tu as un middleware d'auth

router.post("/register", candidateAuthController.registerCandidate);
router.post("/login", candidateAuthController.loginCandidate);
router.patch("/:id/desactiver", candidateAuthController.desactiverCandidate);
router.post("/verify-code", candidateAuthController.verifyEmailCode);
router.post("/resend-verification", candidateAuthController.resendVerification);
// Avec protection : router.patch("/:id/desactiver", protect, candidateAuthController.desactiverCandidate);

module.exports = router;
