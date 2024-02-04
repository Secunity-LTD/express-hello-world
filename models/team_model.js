// models/team_model.js
const mongoose = require('mongoose');
const User = require('./user_model');

const teamSchema = new mongoose.Schema({
    commander: User,
    members: [User],
});

const Team = mongoose.model('Team', userSchema);

module.exports = Team;