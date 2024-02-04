// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('./models/user_model');
const Team = require('./models/team_model');

const app = express();
const port = 3000;
const saltRounds = 10;

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}) 
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

const connection = mongoose.connection;

connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

app.use(cors());
app.use(bodyParser.json());

// Sign Up
app.post('/api/signup', async (req, res) => {
  const { email, password, type } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ email: email, password: hashedPassword, type: type });
    await newUser.save();

    res.status(200).json({ message: 'Login successful'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: { $regex: new RegExp(email, 'i') } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user_type = user.type;
    res.status(200).json({ message: 'Login successful', type: user_type });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Create Team
app.post('/api/Team', async (req, res) => {
  console.log(req.body);
  const teamName = req.body.teamName;
  console.log("TEAMNAME: " + teamName);

  try {
    const existingTeam = await Team.findOne({ name: teamName }); //--
    if (existingTeam) {
      return res.status(409).json({ message: 'Team Name already exists' });
    }
    
    const newTeam = new Team({ name: teamName }); //--
    await newTeam.save();

    res.status(200).json({ message: 'Team added successfully' });
  } catch (error) {
    console.error(error);
    console.error("Error in creating team :" + teamName);
    res.status(500).json({ message: 'Internal Server Error in sever'});
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
