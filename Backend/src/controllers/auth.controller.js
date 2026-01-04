const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { users } = require("../utils/memoryStore");

const signup = async (req, res) => {
  const { email, password } = req.body;

  const exists = users.find((u) => u.email === email);
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: Date.now().toString(),
    email,
    password: hashedPassword,
    quota: 5 * 1024, // 5GB in MB (logic only)
  };

  users.push(user);

  return res.status(201).json({ message: "Signup successful" });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.json({
    token,
    user: {
      email: user.email,
      quota: "5GB",
    },
  });
};

module.exports = { signup, login };
