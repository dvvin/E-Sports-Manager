const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const { Db, ObjectId } = require('mongodb');
const GameList = require('./GameCardDB');
const Users = require('./LoginDB');
const Tournament = require('./TournamentDB');
const loginRoutes = require('./LoginRoutes');
const tournamentRoutes = require('./TournamentRoutes');
require('dotenv').config();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();
app.use(cors());
app.use(express.json());

app.get('/games', async (req, res) => {
        const games = await GameList.find();
        res.json(games);
});

// this route creates a new tournament entry in tournaments collection
app.post('/events', async (req, res) => {


        // if server breaks try running this:

        // try{
        //         await Tournament.collection.drop();
        //         console.log('Event Collection Dropped');
        // } catch (e) {
        //         console.e("Couldn't drop collection", e);
        // }

        try {
                const newTournament = new Tournament(req.body);
                await newTournament.save();

                // increment gamecard tournament count
                const currentGame = newTournament.tournamentGame;
                const gameCard = await GameList.findOne({ name: currentGame })

                // increment tournament here
                gameCard.tournamentCount += 1;
                await gameCard.save();
                res.status(201).json({ message: 'Tournment Successfully Created' })
        } catch (err) {
                console.log('Error is', err)
                res.status(500).json({ error: 'ERROR: Tournament Could not be Created', details: err.message })
        }
})

// this route displays json for all current entered tournaments for react to fetch
// need to add more error handling eventually
app.get('/events/all', async (req, res) => {
        try {
                const allTournaments = await Tournament.find({}, {
                        tournamentGame: 1, tournamentImg: 1,
                        tournamentTitle: 1, tournamentLocation: 1,
                        numPlayers: 1, tournamentStartDate: 1, tournamentAttendees: 1
                });

                res.json(allTournaments)
        } catch (e) {
                console.log('Error', e)
        }
})

// this route displys json for each game's respective tournaments for react to fetch
// need to add more error handling eventually
app.get('/events/:gameName', async (req, res) => {
        const { gameName } = req.params;
        const gameImgURL = await GameList.find({ name: gameName }, { gameBanner: 1, _id: 0 });
        const gameTournaments = await Tournament.find({ tournamentGame: gameName }, {
                tournamentGame: 1, tournamentImg: 1, tournamentTitle: 1, tournamentLocation: 1, numPlayers: 1, tournamentStartDate: 1,
                tournamentAttendees: 1
        })
        res.json({ gameBanner: gameImgURL, tournamentData: gameTournaments });
})

app.use('/uploads', express.static('uploads'));

app.use('/join-event', tournamentRoutes);

app.use('/user', loginRoutes);

// this route updates several user fields
app.put('/user/:username', upload.fields([{ name: 'profilePicture', maxCount: 1 }, { name: 'profileBackground', maxCount: 1 }]), async (req, res) => {
        const { username } = req.params;
        const { username: newUsername, email, bio } = req.body;
        const profilePicture = req.files['profilePicture'] ? req.files['profilePicture'][0].filename : null;
        const profileBackground = req.files['profileBackground'] ? req.files['profileBackground'][0].filename : null;

        try {
                const user = await Users.findOne({ username });

                if (!user) {
                        return res.status(404).json({ message: 'User not found' });
                }

                user.username = newUsername;
                user.email = email;
                user.bio = bio;

                if (profilePicture) {
                        user.profilePicture = `/uploads/${profilePicture}`;
                }
                if (profileBackground) {
                        user.profileBackground = `/uploads/${profileBackground}`;
                }

                await user.save();

                res.json({ message: 'User updated successfully', user });
        } catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Server error' });
        }
});

// this route deletes the user's profile picture or profile background or account
app.delete('/user/:username', async (req, res) => {
        const { username } = req.params;
        const { profilePicture, profileBackground, deleteAccount } = req.body;

        try {
                const user = await Users.findOne({ username });

                if (!user) {
                        return res.status(404).json({ message: 'User not found' });
                }

                if (profilePicture) {
                        user.profilePicture = null; // This sets the profile picture to null, effectively deleting it
                }

                if (profileBackground) {
                        user.profileBackground = null;
                }

                if (deleteAccount) {
                        await Users.deleteOne({ _id: user._id });
                        return res.json({ message: 'User deleted successfully' });
                }

                await user.save();

                res.json({ message: 'User updated successfully', user });
        } catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Server error' });
        }
});

app.use(express.static(path.join(__dirname, '..', 'build')));
app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

const port = process.env.PORT || 4000;
app.listen(port);
console.log(`Server listening on ${port}`);
