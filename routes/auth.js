const express = require("express");
const router = express.Router();
const authController = require("../controller/authcontroller");
const taskController = require("../controller/taskcontroller");
const authenticateToken = require("../middleware/authmiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/tasks",authenticateToken, taskController.gettasks);
router.post("/tasks",authenticateToken, taskController.addtasks);
router.delete("/tasks/:id",authenticateToken, taskController.deletetask);
router.post("/logout", authController.logout);
module.exports = router;
