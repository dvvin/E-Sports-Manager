const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config();

const GameCardURI = process.env.GAMECARD_URI;

const gameCardConnection = mongoose.createConnection(GameCardURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

gameCardConnection.on('connected', () => {
    console.log('GameCardDB connected');
});

const GameCardData = new Schema({
    name: String,
    image: String,
    playerCount: Number,
    tournamentCount: Number,
    gameBanner: String
    
});

const GameList = gameCardConnection.model('Data', GameCardData, 'Data');

module.exports = GameList;
