const express = require('express');
const router = express.Router();
const Tournament = require('./TournamentDB')
const Users = require('./LoginDB');
const ObjectId = require('mongodb').ObjectId;
const GameList = require('./GameCardDB');

// this get route displays individual tournament info on join-event page
router.get('/:tournamentID', async (req, res) => {
        const { tournamentID } = req.params;

        try {
                const tournamentToDisplay = await Tournament.find(
                        { _id: tournamentID }, {
                        tournamentDescription: 1, tournamentImg: 1,
                        tournamentRules: 1, tournamentPrize: 1,
                        tournamentTitle: 1, tournamentStartDate: 1,
                        tournamentAttendees: 1, tournamentLocation: 1,
                        numPlayers: 1, tournamentAttendeeList: 1,
                        startingAttendeeList: 1, organizerUserName: 1,
                        hasStarted: 1, tournamentMaxScore: 1
                });
                res.json(tournamentToDisplay);
        } catch (e) {
                console.log(e);
        }

})


router.post('/:tournamentID', async (req, res) => {
        const { tournamentID } = req.params;
        const { userToAdd } = req.body;


        try {
                const tournament = await Tournament.findById(tournamentID);
                // let user = 'user' + userNum;
                if (tournament && userToAdd) {

                        const newAttendee = {
                                name: userToAdd,
                                score: 0
                        };

                        tournament.tournamentAttendeeList.push(newAttendee);
                        tournament.startingAttendeeList.push(newAttendee);
                        tournament.tournamentAttendees += 1;
                        await tournament.save();


                        const userData = await Users.findOne({ username: { $eq: userToAdd } });
                        userData.tournamentsAttending.push(tournament);
                        userData.tournamentsEntered += 1;
                        await userData.save();

                        // increment gamecard players when user joins tournament
                        const currentGame = tournament.tournamentGame;
                        const gameCard = await GameList.findOne({ name: currentGame })

                        // increment playerCount here
                        gameCard.playerCount += 1;
                        await gameCard.save();

                        res.status(201).json({ message: `User ${userToAdd} Added to Event` });

                } else {
                        res.status(404).json({ message: "Could Not Find Specified Tournament" });
                }

        } catch (e) {
                console.log('Error', e);
        }
})

//this route manipulates the entire bracket of a tournament
router.put('/:tournamentID', async (req, res) => {
        const { tournamentID } = req.params;
        const { action } = req.body;
        console.log(action);
        try {

                const tournament = await Tournament.findById(tournamentID);

                if (tournament && action === 'reset-match') {

                        tournament.tournamentAttendeeList = tournament.startingAttendeeList;
                        tournament.hasStarted = false;
                        await tournament.save();
                        res.status(201).send({ message: 'bracket successfully reset' });
                }

        } catch (e) {

                console.log('Error', e);
                res.status(500).send({ message: 'Unable to make change to bracket' });
        }
})

//this route updates a users scores in a tournament
router.patch('/:tournamentID', async (req, res) => {
        const { tournamentID } = req.params;
        const { userToUpdate, scoreChange, roundResult, action, winnerList, index } = req.body;


        try {

                const tournament = await Tournament.findById(tournamentID);


                if (tournament && action === 'advance-round') {

                        console.log(winnerList.length);
                        if (winnerList.length === 1) {
                                const winner = { ...winnerList[0], hasWon: true, hasLost: true };
                                tournament.tournamentAttendeeList.push(winner)
                                tournament.tournamentAttendeeList.push(winner)
                                console.log('final list', tournament.tournamentAttendeeList)
                                await tournament.save();
                        }

                        else {
                                console.log(tournament.tournamentAttendeeList);
                                tournament.tournamentAttendeeList.push(...winnerList);
                                tournament.hasStarted = true;
                                console.log(winnerList);
                                console.log('advance round else')
                                // const reversedAttendeeList = [...tournament.tournamentAttendeeList].reverse();
                                // tournament.tournamentAttendeeList = reversedAttendeeList;
                                await tournament.save();
                        }


                }

                if (tournament && userToUpdate) {
                        const userInTournament = tournament.tournamentAttendeeList[index]
                        console.log('index', index);
                        // if (roundResult) {
                        //         console.log('loser', userToUpdate);
                        //         console.log('roundResult', roundResult);
                        //         userInTournament.hasLost = roundResult;
                        //         await tournament.save();
                        // }

                        if (scoreChange === 'incremented' && userInTournament.score !== tournament.tournamentMaxScore) {

                                userInTournament.score += 1;
                                console.log(userInTournament.score);

                                if (userInTournament.score === tournament.tournamentMaxScore) {
                                        userInTournament.hasWon = true;

                                        if (index % 2 === 0) {
                                                console.log('works');
                                                tournament.tournamentAttendeeList[index + 1].hasLost = true;
                                        }

                                        else {
                                                tournament.tournamentAttendeeList[index - 1].hasLost = true;
                                        }
                                        console.log(`${userToUpdate} wins`);
                                }


                                await tournament.save();
                                res.status(201).json({ message: `${userToUpdate}'s score incremented.` });
                        } else if (scoreChange === 'decremented') {

                                if (userInTournament.score !== 0) {
                                        userInTournament.score -= 1;
                                        if (index % 2 === 0) {
                                                tournament.tournamentAttendeeList[index + 1].hasLost = false;
                                        }
                                        else {
                                                tournament.tournamentAttendeeList[index - 1].hasLost = false;
                                        }
                                }


                                userInTournament.hasWon = false;


                                await tournament.save();
                                res.status(201).json({ message: `${userToUpdate}'s score decremented.` });

                        }

                }

        } catch (e) {
                console.log(e);
                res.status(500).send('Unable to Update Users Score');
        }
})


//this route deletes a user from a tournament
router.delete('/:tournamentID', async (req, res) => {
        const { tournamentID } = req.params;
        const { userToDelete } = req.body;
        console.log(userToDelete);
        try {
                const tournament = await Tournament.findById(tournamentID);
                if (tournament && userToDelete) {

                        const updatedAttendeeList = tournament.tournamentAttendeeList.filter(attendee => attendee.name !== userToDelete);
                        tournament.tournamentAttendeeList = updatedAttendeeList;
                        tournament.startingAttendeeList = updatedAttendeeList;
                        tournament.tournamentAttendees -= 1;
                        await tournament.save();


                        const userData = await Users.findOne({ username: { $eq: userToDelete } });
                        const tournamentObjectID = new ObjectId(tournamentID);
                        await userData.updateOne({ $pull: { tournamentsAttending: { _id: tournamentObjectID } } });
                        userData.tournamentsEntered -= 1;
                        await userData.save();


                        // decrement gamecard players when user joins tournament
                        const currentGame = tournament.tournamentGame;
                        const gameCard = await GameList.findOne({ name: currentGame })

                        // decrement playerCount here
                        if (gameCard.playerCount !== 0) {
                                gameCard.playerCount -= 1;
                                await gameCard.save();
                        }


                        res.status(201).send(`${userToDelete} Successfully Left the Event`);
                }
        } catch (e) {
                console.log('Error', e);
                res.status(500).send('Unable to Remove User from Event');
        }


})

module.exports = router;