const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get("/stats", dashboardController.getStats);
router.get("/top10/:jobId", dashboardController.getTop10);
router.get("/geo", dashboardController.getGeoData);

module.exports = router;
