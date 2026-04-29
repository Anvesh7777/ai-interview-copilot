const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const generateToken = require("../utils/generateToken");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    const googleRes = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
    );

    const { sub, email, name, picture } = await googleRes.json();

    if (!sub || !email) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google token",
      });
    }

    let user = await User.findOne({ googleId: sub });

    if (!user) {
      user = await User.create({
        googleId: sub,
        email,
        name,
        picture,
      });
    }

    const sessionToken = generateToken(user._id);

    res.status(200).json({
      success: true,
      user,
      token: sessionToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

module.exports = {
  googleAuth,
};