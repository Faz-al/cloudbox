const DMCA = require("../models/DMCA");
const File = require("../models/File");
const User = require("../models/User");

exports.submitDmca = async (req, res) => {
  try {
    const {
      name,
      company,
      email,
      copyrightedWork,
      infringingUrl,
      goodFaith,
      accuracy,
      signature
    } = req.body;

    if (!goodFaith || !accuracy) {
      return res.status(400).json({ message: "Legal confirmations required" });
    }

    // Extract token from CloudBox link
    let token = null;
    if (infringingUrl.includes("/view/")) {
      token = infringingUrl.split("/view/")[1];
    }

    let file = null;
    let user = null;

    if (token) {
      file = await File.findOne({ shareToken: token });
      if (file) user = await User.findById(file.user);
    }

    await DMCA.create({
      name,
      company,
      email,
      copyrightedWork,
      infringingUrl,
      goodFaith,
      accuracy,
      signature,
      relatedFile: file?._id,
      relatedUser: user?._id
    });

    res.json({ success: true });

  } catch (err) {
    console.error("DMCA error", err);
    res.status(500).json({ message: "DMCA submission failed" });
  }
};
