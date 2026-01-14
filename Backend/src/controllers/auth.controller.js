const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const SignupOTP = require("../models/SignupOTP");
const SecuritySession = require("../models/SecuritySession");




/* ===== COOKIE OPTIONS ===== */
const isProd = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};






/* ================= OTP SIGNUP ================= */

const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTPEmail = async (email, otp) => {
  await resend.emails.send({
    from: "CloudBox <no-reply@pawsh.live>",
    to: email,
    subject: "Your CloudBox verification code",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Your CloudBox OTP</h2>
        <p>Use the code below to verify your email:</p>
        <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px;">
          ${otp}
        </div>
        <p>This code expires in 10 minutes.</p>
      </div>
    `,
  });
};


const sendLoginAlertEmail = async ({ email, ip, browser, os, location }) => {
  await resend.emails.send({
    from: "CloudBox <no-reply@pawsh.live>",
    to: email,
    subject: "New login to your CloudBox account",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>New login detected</h2>
        <p>A new device just signed in to your CloudBox account.</p>

        <ul>
          <li><b>Browser:</b> ${browser}</li>
          <li><b>OS:</b> ${os}</li>
          <li><b>Location:</b> ${location}</li>
          <li><b>IP:</b> ${ip}</li>
        </ul>

        <p>If this was you, no action is needed.</p>
        <p>If not, please change your password immediately.</p>
      </div>
    `,
  });
};





// block legacy signup
const signup = async (req, res) => {
  return res.status(400).json({
    message: "Direct signup disabled. Use OTP verification.",
  });
};

// send otp
const signupStart = async (req, res) => {
  try {
   const { email, password } = req.body;

if (!email || !password || password.length < 8) {
  return res.status(400).json({ message: "Invalid data" });
}

const emailNormalized = email.trim().toLowerCase();


    const exists = await User.findOne({ email: emailNormalized });

    if (exists) return res.status(400).json({ message: "User already exists" });

    await SignupOTP.deleteOne({ email: emailNormalized });


    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const passwordHash = await bcrypt.hash(password, 10);
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    await SignupOTP.create({
  email: emailNormalized,
  passwordHash,
      otpHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendOTPEmail(emailNormalized, otp);


    res.json({ message: "OTP sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



// verify otp & create user
const signupVerify = async (req, res) => {
  try {
    const { email, otp } = req.body;

if (!email || !otp) {
  return res.status(400).json({ message: "Invalid data" });
}

const emailNormalized = email.trim().toLowerCase();



    const record = await SignupOTP.findOne({ email: emailNormalized });

    if (!record) return res.status(400).json({ message: "No OTP request" });

    if (record.expiresAt < new Date()) {
      await SignupOTP.deleteOne({ email: emailNormalized });
      return res.status(400).json({ message: "OTP expired" });
    }

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    if (otpHash !== record.otpHash)
      return res.status(400).json({ message: "Invalid OTP" });

    await User.create({
  email: emailNormalized,
  password: record.passwordHash,
      storageLimit: 5 * 1024 * 1024 * 1024,
      usedStorage: 0,
      plan: "free",
      termsAcceptedAt: new Date(),
      termsVersion: "2026-01",
    });

    await SignupOTP.deleteOne({ email: emailNormalized });

    res.status(201).json({ message: "Account created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};




// SendResetpasswordEmail


const sendResetPasswordEmail = async (email, resetUrl) => {
  await resend.emails.send({
    from: "CloudBox <no-reply@pawsh.live>",
    to: email,
    subject: "Reset your CloudBox password",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Password reset request</h2>
        <p>You requested to reset your CloudBox password.</p>

        <p>
          <a
            href="${resetUrl}"
            style="
              display:inline-block;
              padding:12px 20px;
              background:#2563eb;
              color:#ffffff;
              text-decoration:none;
              border-radius:6px;
              font-weight:600;
            "
          >
            Reset password
          </a>
        </p>

        <p>This link expires in 15 minutes.</p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
      </div>
    `,
  });
};




// password change  succeessfull email

const sendPasswordChangedEmail = async (email) => {
  await resend.emails.send({
    from: "CloudBox <no-reply@pawsh.live>",
    to: email,
    subject: "Your CloudBox password was changed",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Password changed</h2>
        <p>Your CloudBox account password was successfully changed.</p>
        <p>If this was you, no action is needed.</p>
        <p style="color:#b91c1c;">
          If you did NOT change your password, please reset it immediately.
        </p>
      </div>
    `,
  });
};















/* ================= LOGIN ================= */

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

if (!email || !password) {
  return res.status(400).json({ message: "Invalid credentials" });
}

const emailNormalized = email.trim().toLowerCase();



    const user = await User.findOne({ email: emailNormalized });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (user.isSuspended)
      return res.status(403).json({ message: "Account suspended" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, tokenVersion: user.tokenVersion || 0 },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, cookieOptions);


    // 🔐 send login alert if new device/IP
setTimeout(async () => {
  try {
    const session = await SecuritySession.findOne({
      userId: user._id,
      isSuspicious: true,
    }).sort({ firstSeen: -1 });

    if (session) {
      await sendLoginAlertEmail({
        email: user.email,
        ip: session.ip,
        browser: session.browser,
        os: session.os,
        location: session.location || "Unknown",
      });

      session.isSuspicious = false; // alert sent once
      await session.save();
      
    }
  } catch (e) {
    console.error("LOGIN ALERT ERROR:", e);
  }
}, 0);




    res.json({
      message: "Login successful",
      user: {
        email: user.email,
        storageLimit: user.storageLimit,
        usedStorage: user.usedStorage,
        plan: user.plan,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= PASSWORD RESET ================= */

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

if (!email) {
  return res.json({ message: "If account exists, email sent" });
}

const emailNormalized = email.trim().toLowerCase();


    const user = await User.findOne({ email: emailNormalized });

    if (!user)
      return res.json({ message: "If account exists, email sent" });

    // 🔥 clear any old reset data first
user.resetPasswordToken = undefined;
user.resetPasswordExpires = undefined;
await user.save();

const resetToken = crypto.randomBytes(32).toString("hex");

user.resetPasswordToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");

user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
await user.save();





    const resetUrl = `https://app.pawsh.live/reset-password/${resetToken}`;
await sendResetPasswordEmail(user.email, resetUrl);





    res.json({ message: "If account exists, email sent" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    // ✅ accept token from params OR body (hard fix)
    const rawToken =
      req.params.token ||
      req.body.token ||
      req.query.token;

    if (!rawToken) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const token = decodeURIComponent(rawToken);

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.tokenVersion = (user.tokenVersion || 0) + 1;

    await user.save();
    await sendPasswordChangedEmail(user.email);

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= LOGOUT ================= */

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });
  res.json({ message: "Logged out" });
};

const logoutAll = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    res.clearCookie("token", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    });

    res.json({ message: "Logged out from all devices" });
  } catch {
    res.status(500).json({ message: "Logout failed" });
  }
};


module.exports = {
  signup,
  signupStart,
  signupVerify,
  login,
  forgotPassword,
  resetPassword,
  logout,
  logoutAll,
};
