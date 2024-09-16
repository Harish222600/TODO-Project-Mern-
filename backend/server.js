const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Task = require('./models/Task'); // Your Task model
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/todoapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

const sendNotification = (task) => {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'user-email@example.com', // Replace with dynamic user email
        subject: 'High Priority Task Reminder',
        text: `Reminder: Your high-priority task "${task.title}" is due soon on ${task.dueDate}.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

// Schedule a task to run every day at midnight
cron.schedule('0 0 * * *', async () => {
    const today = new Date();
    const tasks = await Task.find({
        priority: 'High',
        dueDate: {
            $gte: today.toISOString().split('T')[0], // Compare with the current date
            $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString().split('T')[0] // Only check tasks for today
        }
    });

    tasks.forEach(sendNotification);
});

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
