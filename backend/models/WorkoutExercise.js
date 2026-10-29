const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

module.exports = mongoose.model('User', userSchema);
