const jwt = require("jsonwebtoken");
const { User } = require("../models");

const authenticateToken = (req, res, next) => {
	const token = req.cookies.token; 
	if (!token) {
		return res.status(401).json({ error: "Unauthorized, no token provided" });
	}

	jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
		if (err) {
			return res.status(403).json({ error: "Forbidden, invalid token" });
		}
		console.log(decoded); // Debugging line to check the decoded token
		const user = await User.findByPk(decoded.id); 
		console.log("Decoded user ID:", decoded.id); // Debugging line to check the decoded user ID
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
	
		req.user = user; // Attach user object to the request
		next(); // Proceed to the next middleware or route handler
	});
};

module.exports = authenticateToken;
