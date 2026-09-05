const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

exports.registerAdmin = async (req, res) => {
  try {
    const admin = await Admin.create(req.body);
    res.status(201).json({ id: admin._id, email: admin.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  console.log("=== TENTATIVE DE LOGIN ===");
  console.log("Email reçu :", JSON.stringify(email));
  console.log("Password reçu :", JSON.stringify(password));

  const admin = await Admin.findOne({ email });
  console.log("Admin trouvé en base ?", admin ? "OUI" : "NON");

  if (!admin) {
    console.log("Aucun admin avec cet email dans la collection.");
    return res.status(401).json({ error: "Identifiants invalides" });
  }

  console.log("Email en base :", JSON.stringify(admin.email));
  console.log("Hash stocké en base :", admin.password);

  const match = await admin.comparePassword(password);
  console.log("comparePassword résultat :", match);

  if (!match) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({
    token,
    admin: { id: admin._id, email: admin.email, nom: admin.nom },
  });
};
