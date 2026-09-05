require("dotenv").config({
  path: require("path").join(__dirname, "..", ".env"),
});
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

const ADMIN_EMAIL = "rh@tunisietelecom.tn";
const ADMIN_PASSWORD = "ChangeMoi123!";
const ADMIN_NOM = "Responsable RH";

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connecté à MongoDB");

    const existing = await Admin.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log(
        "Admin existant trouvé. Suppression pour recréer proprement...",
      );
      await Admin.deleteOne({ email: ADMIN_EMAIL });
    }

    // IMPORTANT : pas de bcrypt.hash ici — le hook pre("save") du modèle
    // Admin.js s'en charge automatiquement. Le faire ici en plus = double hash.
    const admin = await Admin.create({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      nom: ADMIN_NOM,
    });

    console.log("Admin créé avec succès :");
    console.log("   Email :", admin.email);
    console.log(
      "   Mot de passe (en clair, à utiliser pour te connecter) :",
      ADMIN_PASSWORD,
    );
  } catch (err) {
    console.error("Erreur lors du seed :", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedAdmin();
