const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Candidate = require("../models/Candidate");
const { sendVerificationCode } = require("../utils/sendEmail");

const generateToken = (candidateId) =>
  jwt.sign({ id: candidateId, role: "candidate" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

const generateCode = () => Math.floor(1000 + Math.random() * 9000).toString(); // toujours 4 chiffres, ex: "0384" à "9999"

exports.registerCandidate = async (req, res) => {
  try {
    const { nom, prenom, email, password } = req.body;
    if (!nom || !prenom || !email || !password) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Le mot de passe doit contenir au moins 6 caractères" });
    }

    const existing = await Candidate.findOne({ email: email.toLowerCase() });
    if (existing && existing.password) {
      return res
        .status(409)
        .json({ error: "Un compte existe déjà avec cet email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const code = generateCode();
    const codeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    let candidate;

    if (existing) {
      existing.password = hashedPassword;
      existing.nom = existing.nom || nom;
      existing.prenom = existing.prenom || prenom;
      existing.isVerified = false;
      existing.verificationCode = code;
      existing.verificationCodeExpires = codeExpires;
      candidate = await existing.save();
    } else {
      candidate = await Candidate.create({
        nom,
        prenom,
        email: email.toLowerCase(),
        password: hashedPassword,
        isVerified: false,
        verificationCode: code,
        verificationCodeExpires: codeExpires,
      });
    }

    try {
      await sendVerificationCode(candidate.email, code);
    } catch (mailErr) {
      console.error("ERREUR ENVOI EMAIL :", mailErr);
      return res.status(500).json({
        error:
          "Compte créé mais le code de vérification n'a pas pu être envoyé",
      });
    }

    res.status(201).json({
      message:
        "Compte créé. Un code de vérification a été envoyé à votre email.",
      email: candidate.email,
    });
  } catch (err) {
    console.error("ERREUR REGISTER :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.verifyEmailCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: "Email et code sont requis" });
    }

    const candidate = await Candidate.findOne({
      email: email.toLowerCase(),
    }).select("+verificationCode +verificationCodeExpires");

    if (!candidate) {
      return res.status(404).json({ error: "Aucun compte avec cet email" });
    }

    if (candidate.isVerified) {
      return res.status(400).json({ error: "Ce compte est déjà vérifié" });
    }

    if (!candidate.verificationCode || !candidate.verificationCodeExpires) {
      return res
        .status(400)
        .json({ error: "Aucun code en attente, redemandez-en un" });
    }

    if (candidate.verificationCodeExpires < new Date()) {
      return res
        .status(400)
        .json({ error: "Ce code a expiré, redemandez-en un" });
    }

    if (candidate.verificationCode !== code) {
      return res.status(400).json({ error: "Code incorrect" });
    }

    candidate.isVerified = true;
    candidate.verificationCode = undefined;
    candidate.verificationCodeExpires = undefined;
    await candidate.save();

    const token = generateToken(candidate._id);

    res.status(200).json({
      message: "Email vérifié avec succès",
      token,
      candidate: {
        _id: candidate._id,
        nom: candidate.nom,
        prenom: candidate.prenom,
        email: candidate.email,
      },
    });
  } catch (err) {
    console.error("ERREUR VERIFY CODE :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email requis" });
    }

    const candidate = await Candidate.findOne({ email: email.toLowerCase() });
    if (!candidate) {
      return res.status(404).json({ error: "Aucun compte avec cet email" });
    }
    if (candidate.isVerified) {
      return res.status(400).json({ error: "Ce compte est déjà vérifié" });
    }

    const code = generateCode();
    candidate.verificationCode = code;
    candidate.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    await candidate.save();

    await sendVerificationCode(candidate.email, code);

    res.status(200).json({ message: "Nouveau code envoyé" });
  } catch (err) {
    console.error("ERREUR RESEND :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.loginCandidate = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email et mot de passe sont requis" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const candidate = await Candidate.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!candidate) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    if (!candidate.password) {
      return res.status(401).json({
        error: "Ce compte ne possède pas encore de mot de passe",
      });
    }

    const match = await bcrypt.compare(password, candidate.password);
    if (!match) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    if (!candidate.isVerified) {
      return res.status(403).json({
        error: "Veuillez vérifier votre email avant de vous connecter",
      });
    }

    const token = generateToken(candidate._id);

    res.json({
      token,
      candidate: {
        _id: candidate._id,
        nom: candidate.nom,
        prenom: candidate.prenom,
        email: candidate.email,
      },
    });
  } catch (err) {
    console.error("ERREUR LOGIN BACKEND :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.desactiverCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidat introuvable" });
    }

    if (req.candidate && req.candidate.id !== id) {
      return res.status(403).json({ error: "Action non autorisée" });
    }

    candidate.actif = false;
    candidate.dateDesactivation = new Date();
    await candidate.save();

    res.status(200).json({
      message:
        "Compte désactivé avec succès. Vos données seront supprimées dans 30 jours.",
    });
  } catch (err) {
    console.error("ERREUR DESACTIVATION :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
