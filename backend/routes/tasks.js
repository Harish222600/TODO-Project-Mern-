const express = require('express');
const Task = require('../models/Task');

const router = express.Router();

// Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching tasks' });
    }
});

// Create a new task
router.post('/', async (req, res) => {
    const newTask = new Task({
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        dueDate: req.body.dueDate,
        category: req.body.category,
    });
    try {
        const savedTask = await newTask.save();
        res.json(savedTask);
    } catch (error) {
        res.status(500).json({ error: 'Error creating task' });
    }
});

// Update a task
router.put('/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                completed: req.body.completed,
                description: req.body.description,
                priority: req.body.priority,
                dueDate: req.body.dueDate,
                category: req.body.category,
            },
            { new: true } // return the updated task
        );
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Error updating task' });
    }
});

// Delete a task
router.delete('/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting task' });
    }
});

module.exports = router;
