const SecuritySession = require("../models/SecuritySession");
const UAParser = require("ua-parser-js");
const crypto = require("crypto");

module.exports = async function securityTracker(req, res, next) {
  console.log("SECURITY TRACKER HIT, USER:", req.user);

  try {
    if (!req.user?.id) return next();

    const ip =
  (req.headers["x-forwarded-for"] || "").split(",")[0] ||
  req.socket.remoteAddress;

    const uaString = req.headers["user-agent"] || "";
    const parser = new UAParser(uaString);
    const ua = parser.getResult();

    const fingerprint = crypto
      .createHash("sha1")
      .update(ua.browser.name + ua.os.name + uaString)
      .digest("hex");


      let location = "Unknown";

try {
  const res = await fetch(`https://ipapi.co/${ip}/json/`);
  const geo = await res.json();
  location = `${geo.city || "Unknown"}, ${geo.country_name || "Unknown"}`;
} catch {}






    let session = await SecuritySession.findOne({
      userId: req.user.id,
      fingerprint,
    });

    if (!session) {
      const knownIp = await SecuritySession.findOne({
        userId: req.user.id,
        ip,
      });

      session = await SecuritySession.create({
        userId: req.user.id,
        fingerprint,
        ip,
        location,
        userAgent: uaString,
        browser: ua.browser.name || "Unknown",
        os: ua.os.name || "Unknown",
        device: ua.device.type || "Desktop",
        isSuspicious: !knownIp,
      });
    }

    session.lastSeen = new Date();
    session.isCurrent = true;
    await session.save();
  } catch (e) {
    console.error("SECURITY TRACKER ERROR:", e);
  }

  const SecuritySession = require("../models/SecuritySession");
const UAParser = require("ua-parser-js");
const crypto = require("crypto");

module.exports = async function securityTracker(req, res, next) {
  console.log("SECURITY TRACKER HIT, USER:", req.user);

  try {
    if (!req.user?.id) return next();

    const ip =
  (req.headers["x-forwarded-for"] || "").split(",")[0] ||
  req.socket.remoteAddress;

    const uaString = req.headers["user-agent"] || "";
    const parser = new UAParser(uaString);
    const ua = parser.getResult();

    const fingerprint = crypto
      .createHash("sha1")
      .update(ua.browser.name + ua.os.name + uaString)
      .digest("hex");


      let location = "Unknown";

try {
  const res = await fetch(`https://ipapi.co/${ip}/json/`);
  const geo = await res.json();
  location = `${geo.city || "Unknown"}, ${geo.country_name || "Unknown"}`;
} catch {}






    let session = await SecuritySession.findOne({
      userId: req.user.id,
      fingerprint,
    });

    if (!session) {
      const knownIp = await SecuritySession.findOne({
        userId: req.user.id,
        ip,
      });

      session = await SecuritySession.create({
        userId: req.user.id,
        fingerprint,
        ip,
        location,
        userAgent: uaString,
        browser: ua.browser.name || "Unknown",
        os: ua.os.name || "Unknown",
        device: ua.device.type || "Desktop",
        isSuspicious: !knownIp,
      });
    }

    session.lastSeen = new Date();
    session.isCurrent = true;
    await session.save();
  } catch (e) {
    console.error("SECURITY TRACKER ERROR:", e);
  }

  next();
};


  next();
};
