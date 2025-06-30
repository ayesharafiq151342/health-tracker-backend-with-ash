import nodeMailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodeMailer.createTransport({
  host: process.env.SMTP_HOST,        // e.g. smtp-relay.brevo.com
  port: Number(process.env.SMTP_PORT), // should be 587
  secure: false,                      // false for port 587
  auth: {
    user: process.env.SMTP_USER,      // your Brevo sender address
    pass: process.env.SMTP_PASS,      // Brevo SMTP password (not your email password)
  },
  tls: {
    rejectUnauthorized: false,        // Optional: use if you're getting self-signed cert errors
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter error:", error.message);
  } else {
    console.log("✅ Email transporter ready");
  }
});

export default transporter;
