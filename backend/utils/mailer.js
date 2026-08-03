const nodemailer = require('nodemailer');

const sendOtpEmail = async (email, otp) => {
  console.log(`====================================`);
  console.log(`[OTP VERIFICATION] Email: ${email}`);
  console.log(`[OTP VERIFICATION] Code: ${otp}`);
  console.log(`====================================`);

  // Support both SMTP_* and EMAIL_* variables, default to gmail host/port
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = process.env.SMTP_PORT || 587;
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!smtpUser || !smtpPass) {
    console.log(`[mailer] SMTP details missing in .env. OTP logged to console instead of sending email.`);
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: parseInt(smtpPort) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const mailOptions = {
      from: `"MediAssist" <${smtpUser}>`,
      to: email,
      subject: "MediAssist - Email Verification OTP",
      text: `Your verification code is: ${otp}. This code is valid for 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #180991;">MediAssist Verification</h2>
          <p>Thank you for registering. Please use the following One-Time Password (OTP) to verify your email address:</p>
          <div style="background-color: #f4f7fe; padding: 15px; border-radius: 8px; font-size: 24px; font-weight: bold; text-align: center; color: #180991; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This OTP is valid for <strong>5 minutes</strong>. If you did not request this code, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[mailer] Email successfully sent to ${email}`);
    return true;
  } catch (error) {
    console.error("[mailer] Error sending email via SMTP:", error);
    return false;
  }
};

module.exports = { sendOtpEmail };
