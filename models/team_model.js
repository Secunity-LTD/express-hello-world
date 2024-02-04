// models/team_model.js
const mongoose = require('mongoose');
const User = require('./user_model');

const teamSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true},
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;