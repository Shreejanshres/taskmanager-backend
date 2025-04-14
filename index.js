const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const allowedOrigins = ["http://localhost:5173", "https://yourdomain.com"];

const corsOptions = {
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	credentials: true,
};
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/authmiddleware");

const { sequelize, User, Task } = require("./models");

const app = express();
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());

// Health check
app.get("/", (req, res) => res.send("API running"));

app.use("/", authRoutes);

sequelize
	.sync({ alter: true })
	.then(() => {
		app.listen(process.env.PORT, () => {
			console.log(`Server running on port ${process.env.PORT}`);
		});
	})
	.catch((err) => {
		console.error("DB connection failed:", err);
	});
