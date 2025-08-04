// create express app
const express = require('express');
const app = express();

// middleware to parse JSON
app.use(express.urlencoded({ extended: true }));

// ROUTE: create a new user
app.post('/api/users', async (req, res) => {
x
    // get username 
    const { username } = req.body.username;

    // check if username is provided
    if (!username) 
        return res.status(400).json({ error: 'Username is required' });

    // parse username
    const parsedUsername = username.trim();
    
    // create new user
    const User = require('./models/User');
    const user = new User({ parsedUsername });

    // save user to database
    try {
        const savedUser = await user.save();
        res.status(201).json({ _id: savedUser._id, username: savedUser.username });
    } catch (error) {
        res.status(500).json({ error: 'Error saving user' });
    }
});

// ROUTE: list all users
app.get('/api/users', async (req, res) => {

    // import User model
    const User = require('./models/User');

    // fetch users from database
    try {
        const users = await User.find({}, { username: 1, _id: 1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// ROUTE: add an exercise to a user
app.post('/api/users/:_id/exercises', async (req, res) => {

    // get user ID and exercise details
    const userId = req.params._id;
    const { description, duration, date } = req.body;

    // import User and Exercise models
    const User = require('./models/User');
    const Exercise = require('./models/Exercise');

    try{
        // find user by ID
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // create exercise object
        const exercise = new Exercise({
            userId: user._id,
            description,
            duration,
            date: date ? new Date(date) : new Date()
        });

        // save exercise to database
        const savedExercise = await exercise.save();
        
        // respond with exercise details
        res.status(201).json({
            _id: user._id,
            username: user.username,
            description: savedExercise.description,
            duration: savedExercise.duration,
            date: savedExercise.date.toDateString()
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Error saving exercise' });
    }
});

// ROUTE: get exercise log for a user
app.get('/api/users/:_id/logs', async (req, res) => {
    
    // get user ID and query parameters
    const userId = req.params._id;
    const { from, to, limit } = req.query;

    // import User and Exercise models
    const User = require('./models/User');
    const Exercise = require('./models/Exercise');

    try{
        // find user by ID
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // build query for exercises
        let query = { userId: user._id };
        if (from) query.date = { $gte: new Date(from) };
        if (to) query.date = { ...query.date, $lte: new Date(to) };

        // fetch exercises from database
        const exercises = await Exercise.find(query).limit(parseInt(limit) || 100);

        // format response
        const log = exercises.map(ex => ({
            description: ex.description,
            duration: ex.duration,
            date: ex.date.toDateString()
        }));

        res.status(200).json({
            _id: user._id,
            username: user.username,
            count: log.length,
            log
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching exercise log' });
    }
});

// export app
module.exports = app;