
console.log("CONNECTED TO DB:", process.env.MONGO_URI);


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
    from: "CloudBox <no-reply@safevault.in>",
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
    from: "CloudBox <no-reply@safevault.in>",
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
    from: "CloudBox <no-reply@safevault.in>",
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
    from: "CloudBox <no-reply@safevault.in>",
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





const sendLoginOTPEmail = async (email, otp) => {
  await resend.emails.send({
    from: "CloudBox <no-reply@safevault.in>",
    to: email,
    subject: "Your CloudBox login code",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Login verification</h2>
        <p>Use this code to complete your login:</p>
        <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px;">
          ${otp}
        </div>
        <p>This code expires in 5 minutes.</p>
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



    console.log("LOGIN USER ID:", user?._id.toString());





    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (user.isSuspended)
      return res.status(403).json({ message: "Account suspended" });

    const match = await bcrypt.compare(password, user.password);


    console.log("=== LOGIN DEBUG ===");
console.log("Email:", user.email);
console.log("email2FAEnabled value:", user.email2FAEnabled);
console.log("email2FAEnabled type:", typeof user.email2FAEnabled);




    if (!match) return res.status(400).json({ message: "Invalid credentials" });


    // 🔐 EMAIL 2FA CHECK (LOGIN ONLY)
if (user.email2FAEnabled) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  const LoginOTP = require("../models/LoginOTP");
  console.log("DB USER ID:", user._id.toString());
console.log("DB EMAIL:", user.email);
console.log("DB email2FAEnabled:", user.email2FAEnabled);

  // clear old OTPs
  await LoginOTP.deleteMany({ userId: user._id });

  await LoginOTP.create({
    userId: user._id,
    otpHash,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  await sendLoginOTPEmail(user.email, otp);

  return res.json({
    requires2FA: true,
    userId: user._id,
  });
}









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



/* ================= update password ================= */

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: "Current password incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.tokenVersion = (user.tokenVersion || 0) + 1;

    await user.save();
    await sendPasswordChangedEmail(user.email);

    res.json({ message: "Password changed successfully" });
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





    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

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



const verifyLoginOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const LoginOTP = require("../models/LoginOTP");

    const record = await LoginOTP.findOne({ userId });
    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    if (otpHash !== record.otpHash) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await LoginOTP.deleteMany({ userId });

    const user = await User.findById(userId);

    const token = jwt.sign(
      { id: user._id, email: user.email, tokenVersion: user.tokenVersion || 0 },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, cookieOptions);

    res.json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const toggleEmail2FA = async (req, res) => {
  try {
    const { currentPassword } = req.body;

    const user = await User.findById(req.user.id).select("password email2FAEnabled");



    // 🔐 If disabling 2FA, require password
    if (user.email2FAEnabled) {
      if (!currentPassword) {
        return res.status(400).json({
          message: "Password required to disable 2FA",
        });
      }

      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) {
        return res.status(400).json({
          message: "Incorrect password",
        });
      }
    }

    // toggle
    user.email2FAEnabled = !user.email2FAEnabled;
    await user.save();

    res.json({ enabled: user.email2FAEnabled });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};





const resendLoginOTP = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const LoginOTP = require("../models/LoginOTP");
    const user = await User.findById(userId);

    if (!user || !user.email2FAEnabled) {
      return res.status(400).json({ message: "Invalid request" });
    }

    // 🔒 cooldown check (30 seconds)
    const lastOtp = await LoginOTP.findOne({ userId }).sort({ createdAt: -1 });

    if (lastOtp) {
      const secondsSinceLast =
        (Date.now() - new Date(lastOtp.createdAt).getTime()) / 1000;

      if (secondsSinceLast < 30) {
        return res.status(429).json({
          message: `Please wait ${Math.ceil(30 - secondsSinceLast)} seconds before resending OTP`,
        });
      }
    }

    // ❌ invalidate previous OTPs
    await LoginOTP.deleteMany({ userId });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    await LoginOTP.create({
      userId,
      otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendLoginOTPEmail(user.email, otp);

    res.json({ message: "OTP resent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};












module.exports.signup = signup;
module.exports.signupStart = signupStart;
module.exports.signupVerify = signupVerify;
module.exports.login = login;
module.exports.verifyLoginOTP = verifyLoginOTP;
module.exports.resendLoginOTP = resendLoginOTP;
module.exports.toggleEmail2FA = toggleEmail2FA;
module.exports.changePassword = changePassword;
module.exports.forgotPassword = forgotPassword;
module.exports.resetPassword = resetPassword;
module.exports.logout = logout;
module.exports.logoutAll = logoutAll;

