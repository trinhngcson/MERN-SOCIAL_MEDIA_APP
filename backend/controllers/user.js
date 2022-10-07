const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    user = await User.create({
      name,
      email,
      password,
      avatar: { public_id: "sample_id", url: "Sample_url" },
    });

    res.status(201).json({ success: true, user: user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, message: "Please enter Email && Password" });
    }
    const user = await User.findOne({ email: email }).select("+password");
    if (!user) {
      res.status(400).json({ success: false, message: "None user found" });
    }
    const isPasswordMatched = await user.matchPassword(password);
    if (!isPasswordMatched) {
      res.status(400).json({ success: false, message: "Password wrong" });
    }
    const token = await user.generateToken();
    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      })
      .json({ success: true, user: user, token });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
