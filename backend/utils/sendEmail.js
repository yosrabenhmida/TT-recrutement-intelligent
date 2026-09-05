const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationCode = async (to, code) => {
  await transporter.sendMail({
    from: `"TT Recruit" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Votre code de vérification - TT Recruit",
    html: `
      <div style="font-family: Arial, sans-serif; max-width:480px; margin:auto; text-align:center;">
        <h2 style="color:#0B4E9B;">Bienvenue sur TT Recruit</h2>
        <p>Voici votre code de vérification :</p>
        <div style="display:inline-block;padding:16px 32px;background:#29ABE2;color:#fff;
                    border-radius:12px;font-size:32px;font-weight:bold;letter-spacing:8px;margin:16px 0;">
          ${code}
        </div>
        <p style="font-size:13px;color:#888;">Ce code expire dans 10 minutes.</p>
        <p style="margin-top:16px;font-size:12px;color:#888;">Si vous n'êtes pas à l'origine de cette inscription, ignorez cet email.</p>
      </div>
    `,
  });
};

module.exports = { sendVerificationCode };
