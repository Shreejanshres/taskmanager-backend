const { User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// Generate
const generateToken = (user) => {
	return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "3h" });
};

// Register
exports.register = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const existing = await User.findOne({ where: { email } });
		if (existing) return res.status(400).json({ error: "User already exists" });

		// const hashedPassword = await bcrypt.hash(password, 12);
		const user = await User.create({ name, email, password });
		if (!user) return res.status(400).json({ error: "User creation failed" });
		const token = generateToken(user);
		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "Strict",
			maxAge: 3 * 60 * 60 * 1000,
		});
		res.status(201).json({ success: true });
	} catch (err) {
		res.status(500).json({ error: "Registration failed", detail: err.message });
	}
};

// Login
exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ error: "Email and password are required" });
		}

		const user = await User.findOne({ where: { email } });
		if (!user || !(await user.validPassword(password))) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		const token = generateToken(user); // Assuming generateToken is a utility that creates JWTs
		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "None",
			maxAge: 3 * 60 * 60 * 1000, // 3 hours
		});
		res.status(200).json({ success: true });
	} catch (err) {
		res.status(500).json({ error: "Login failed", detail: err.message });
	}
};


exports.logout = async (req, res) => {
	try {
		res.clearCookie("token", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "Strict",
		});
		res.status(200).json({ success: true });
	} catch (err) {
		res.status(500).json({ error: "Logout failed", detail: err.message });
	}

}