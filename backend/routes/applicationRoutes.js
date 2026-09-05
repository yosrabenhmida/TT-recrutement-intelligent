const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");

const upload = require("../middleware/upload");

router.post(
  "/upload-cv",
  upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "lettreMotivation", maxCount: 1 },
    { name: "lettreAffectation", maxCount: 1 },
  ]),
  (req, res) => {
    if (!req.files?.cv)
      return res.status(400).json({ error: "Aucun CV fourni" });

    res.json({
      cvUrl: `/uploads/cv/${req.files.cv[0].filename}`,
      lettreMotivationUrl: req.files.lettreMotivation
        ? `/uploads/cv/${req.files.lettreMotivation[0].filename}`
        : null,
      lettreAffectationUrl: req.files.lettreAffectation
        ? `/uploads/cv/${req.files.lettreAffectation[0].filename}`
        : null,
    });
  },
);

router.post("/fix-missing-statut", async (req, res) => {
  const Application = require("../models/Application");
  const result = await Application.updateMany(
    { statut: { $exists: false } },
    { $set: { statut: "nouveau" } },
  );
  res.json(result);
});

router.post("/", applicationController.createApplication);

// Routes spécifiques AVANT la route générique "/:id"
router.get("/job/:jobId", applicationController.getApplicationsByJob);
router.get("/candidate", applicationController.getApplicationsByCandidateEmail);
router.get(
  "/candidate/:candidateId",
  applicationController.getApplicationsByCandidate,
);

router.patch("/:id/entretien", applicationController.planifierEntretien);
router.get("/entretiens/all", applicationController.getEntretiens);
router.patch("/:id/invite-chatbot", applicationController.inviteToChatbot);
router.get("/:id", applicationController.getApplicationById);
router.delete("/:id", applicationController.deleteApplication);
router.patch("/:id/status", applicationController.updateApplicationStatus);

module.exports = router;
