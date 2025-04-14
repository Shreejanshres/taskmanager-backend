const { User } = require("../models");
const { Task } = require("../models");

exports.gettasks = async (req, res) => {
	try {
		const userId = req.user.id; // Get user ID from the request (added by the middleware)
		if (!userId) {
			return res.status(401).json({ error: "Unauthorized, no user ID found" });
		}

		// Query tasks based on userId
		const tasks = await Task.findAll({
			where: { user_id: userId },
			order: [["createdAt", "DESC"]],
		});

		if (!tasks.length) {
			return res.status(404).json({ error: "No tasks found" });
		}

		res.status(200).json(tasks);
	} catch (error) {
		console.error(error); // Log the error for debugging
		res.status(500).json({ error: "Internal server error" });
	}
};

exports.addtasks = async (req, res) => {
	try {
		const userId = req.user.id; // Get user ID from the request
		const { title, description } = req.body;

		if (!title || !description) {
			return res.status(400).json({ error: "Title and description are required" });
		}

		const task = await Task.create({
			title,
			description,
			user_id: userId,
		});

		res.status(201).json(task);
	} catch {
		res.status(500).json({ error: "Internal server error" });
	}
};

exports.deletetask = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from the request
        const taskId = req.params.id;

        if (!taskId) {
            return res.status(400).json({ error: "Task ID is required" });
        }

        const task = await Task.findOne({
            where: { id: taskId, user_id: userId },
        });

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        await task.destroy();

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: "Internal server error" });
    }
}