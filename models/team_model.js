// models/team_model.js
const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;