const JobOffer = require("../models/JobOffer");

exports.createJob = async (req, res) => {
  try {
    const job = await JobOffer.create(req.body);
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getJobs = async (req, res) => {
  const jobs = await JobOffer.find().sort({ createdAt: -1 });
  res.json(jobs);
};

exports.getJobById = async (req, res) => {
  const job = await JobOffer.findById(req.params.id);
  if (!job) return res.status(404).json({ error: "Offre introuvable" });
  res.json(job);
};

exports.updateJob = async (req, res) => {
  const job = await JobOffer.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
  });
  res.json(job);
};

exports.deleteJob = async (req, res) => {
  await JobOffer.findByIdAndDelete(req.params.id);
  res.json({ message: "Offre supprimée" });
};
