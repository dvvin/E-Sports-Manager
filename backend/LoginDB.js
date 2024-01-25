const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config();

const LoginURI = process.env.LOGIN_URI;

const loginConnection = mongoose.createConnection(LoginURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

loginConnection.on('connected', () => {
    console.log('LoginDB connected');
});

const UserData = new Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['user', 'admin'], default: 'user' },
    profilePicture: { type: String, default: 'https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg' },
    profileBackground: { type: String, default: 'https://funent.com/images/template/page-banner-default.jpg' },
    bio: { type: String, default: '' },
    tournamentsEntered: { type: Number, default: 0 },
    tournamentsWon: { type: Number, default: 0 },

    tournamentsAttending: [
        {
            type: Schema.Types.Mixed,
            unique: true
        }

    ]
});

const Users = loginConnection.model('UserData', UserData);

module.exports = Users;
