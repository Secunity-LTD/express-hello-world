// models/team_model.js
const mongoose = require('mongoose');
const User = require('./user_model');

const teamSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    Team_Leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
