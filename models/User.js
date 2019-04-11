const mongoose = require('mongoose');
const encryption = require('../util/encryption');

const userSchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    hashedPass: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    firstName: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    lastName: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    salt: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    roles: [{
        type: mongoose.Schema.Types.String,
    }],
    profilePicture: {
        type: mongoose.Schema.Types.String,
        default: "https://i.pinimg.com/236x/d9/d1/3f/d9d13f399d9611c5c26f12545759162e--fb-profile-facebook-profile.jpg",
    },
    teams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
    }],
});

userSchema.method({
    authenticate: function (password) {
        return encryption.generateHashedPassword(this.salt, password) === this.hashedPass;
    }
});

const User = mongoose.model('User', userSchema);

User.seedAdminUser = async () => {
    try {
        let users = await User.find();
        if (users.length > 0) return;
        const salt = encryption.generateSalt();
        const hashedPass = encryption.generateHashedPassword(salt, 'admin');
        return User.create({
            username: 'admin',
            salt,
            hashedPass,
            firstName: "Irena",
            lastName: "Mishonova",
            roles: ['Admin']
        });
    } catch (e) {
        console.log(e);
    }
};

module.exports = User;