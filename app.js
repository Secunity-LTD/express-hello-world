// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('./models/user_model');

const app = express();
const port = 3000;
const saltRounds = 10;

const connectionString = 'mongodb+srv://Secunity:Secunity282@cluster0.4kv16wv.mongodb.net/secunity?retryWrites=true&w=majority';
const dbName = 'Secunity';

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

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
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

app.post('/api/Teams', async (req, res) => {
  const collectionName = 'Team';
  
  const { teamName } = req.body;

  const client = new MongoClient(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // Connect to the MongoDB server
    await client.connect();

    const document = {
      teamName: teamName,
      teamLeader: teamLeader,
      teamMembers: teamMembers,
      // Add other fields as needed
  };

    // Access the specified database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Insert the document into the collection
    const result = await collection.insertOne(document);

    // Log the inserted document's ID
    console.log(`Document inserted with ID: ${result.insertedId}`);
  } finally {
    // Close the MongoDB connection
    await client.close();
  }

});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
