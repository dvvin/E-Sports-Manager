import './Bracket.css'
import { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { UserContextTest } from '../Login/CurrentUserContext';
export default function Bracket({ numPlayers, players, pointsToWin = 7, tournamentID = null, resetClick, onAdvanceRound }) {


    const { currentUser, setCurrentUser } = useContext(UserContextTest);
    console.log('bracket current user', currentUser);
    const [isOrganizer, setIsOrganizer] = useState(false);
    const [player, setPlayer] = useState([]);

    // these variables are being fetched from the database
    const [playerScores, setPlayerScores] = useState([]);
    const [hasWonRecords, setHasWonRecords] = useState([]);
    const [hasLostRecords, setHasLostRecords] = useState([]);
    const [isWinnerRecords, setIsWinnerRecords] = useState([]);


    // this array will store the winners of each round
    const [winners, setWinners] = useState([])


    useEffect(() => {
        async function isOrganizerCheck() {
            const response = await axios.get(`/join-event/${tournamentID}`);

            const organizerName = response.data[0].organizerUserName

            setIsOrganizer(currentUser === organizerName);
            console.log('tournament data', response.data[0])

        }

        isOrganizerCheck();
    }, [currentUser])

    useEffect(() => {

        async function getPlayerScores() {
            const response = await axios.get(`/join-event/${tournamentID}`);

            setPlayerScores(response.data[0].tournamentAttendeeList.map(attendee => attendee.score));
            setHasWonRecords(response.data[0].tournamentAttendeeList.map(attendee => attendee.hasWon));
            setHasLostRecords(response.data[0].tournamentAttendeeList.map(attendee => attendee.hasLost));
            setIsWinnerRecords(response.data[0].tournamentAttendeeList.map(attendee => attendee.isWinner));
            console.log('plyers', player)
        }

        getPlayerScores();
        console.log('scores', playerScores);


        const playerArray = players.map((player, index) => ({
            name: player,
            hasWon: hasWonRecords[index] || false,
            hasLost: hasLostRecords[index] || false,
            isWinner: isWinnerRecords[index] || false,
            playerScore: playerScores[index] || 0
        }))

        setPlayer(playerArray);
    }, [players])




    const handleWin = (index) => {

        try {
            const updatedPlayer = [...player];
            updatedPlayer[index] = { ...updatedPlayer[index], hasWon: !updatedPlayer[index].hasWon };
            setPlayer(updatedPlayer);

            if (updatedPlayer[index].hasWon === false) {
                const updatedWinners = winners.filter(winner => winner.hasWon === false);
                setWinners(updatedWinners);
            } else {
                setWinners([...winners, updatedPlayer[index]]);

            }
        } catch (e) {
            console.log('Spot not yet filled', e);

        }


    }

    const incrementScore = async (index) => {

    
        const updatedPlayer = [...player];
        let ableToIncrement = false;
        console.log(ableToIncrement);
        if (updatedPlayer[index].playerScore !== pointsToWin) {

            console.log('1st block');
            ableToIncrement = true;
            const dataToSend = {
                userToUpdate: updatedPlayer[index].name,
                scoreChange: 'incremented',
                index: index

            }

            await axios.patch(`/join-event/${tournamentID}`, dataToSend);

            updatedPlayer[index] = { ...updatedPlayer[index], playerScore: updatedPlayer[index].playerScore += 1 };
            console.log('score', updatedPlayer[index].playerScore);
            updatedPlayer[index].hasWon = false;

            setPlayer(updatedPlayer);




            // console.log(updatedPlayer);
            // console.log(index);
        }



        if (updatedPlayer[index].playerScore === pointsToWin && ableToIncrement === true) {
            console.log('2nd block');

            // console.log('score', updatedPlayer[index].playerScore)
            updatedPlayer[index].hasWon = true;

            handleWin(index);

            if (index % 2 === 0) {
                updatedPlayer[index + 1].hasLost = true;
                const dataToSend = {
                    userToUpdate: updatedPlayer[index + 1].name,
                    roundResult: true,
                    index: index
                }
                await axios.patch(`/join-event/${tournamentID}`, dataToSend);
                ableToIncrement = false;

            }

            else {
                console.log('3rd block');

                updatedPlayer[index - 1].hasLost = true;

                const dataToSend = {
                    userToUpdate: updatedPlayer[index - 1].name,
                    roundResult: true,
                    index: index
                }
                await axios.patch(`/join-event/${tournamentID}`, dataToSend);

            }



        }


    }


    const decrementScore = async (index) => {
        const updatedPlayer = [...player];

        if (updatedPlayer[index].playerScore !== 0) {

            updatedPlayer[index] = { ...updatedPlayer[index], playerScore: updatedPlayer[index].playerScore -= 1 };
            // console.log(index);

            if (index % 2 === 0) {
                updatedPlayer[index + 1].hasLost = false;
                const dataToSend = {
                    userToUpdate: updatedPlayer[index + 1].name,
                    scoreChange: 'decremented',
                    index: index
                }
                await axios.patch(`/join-event/${tournamentID}`, dataToSend);
            }

            else {
                updatedPlayer[index - 1].hasLost = false;
                const dataToSend = {
                    userToUpdate: updatedPlayer[index - 1].name,
                    scoreChange: 'decremented',
                    index: index

                }
                await axios.patch(`/join-event/${tournamentID}`, dataToSend);
            }



            setPlayer(updatedPlayer);
            // console.log(updatedPlayer);

            const dataToSend = {
                userToUpdate: updatedPlayer[index].name,
                scoreChange: 'decremented',
                index: index
            }
            await axios.patch(`/join-event/${tournamentID}`, dataToSend);


        }
        updatedPlayer[index].hasWon = false;

    }

    const advanceRound = async () => {

        await onAdvanceRound();

        const winnerArray = winners.map(winner => ({ ...winner, hasWon: false, playerScore: 0 }))
        const winnerNames = winners.map(winner => (winner.name))
        const updatedPlayers = [...player, ...winnerArray];


        for (let winner of winnerNames) {
            players.push(winner)
        }

        console.log('winner array', winnerArray);

        setPlayer(updatedPlayers);
        setWinners([])




        if (winnerNames.length !== 1) {

            const dataToSend = {
                winnerList: winnerArray,
                action: 'advance-round',

            }

            console.log('data sent to db', winnerArray);
            await axios.patch(`/join-event/${tournamentID}`, dataToSend);
        }




        else if (winnerNames.length === 1) {
            const winnerIndex = updatedPlayers.length;
            updatedPlayers[winnerIndex] = { ...updatedPlayers[winnerIndex], hasWon: true, isWinner: true };
            // console.log(updatedPlayers[winnerIndex])
            const dataToSend = {
                winnerList: winnerArray,
                action: 'advance-round',

            }

            console.log('data sent to db', winnerArray);
            await axios.patch(`/join-event/${tournamentID}`, dataToSend);


            console.log('WINNERRRERER,', updatedPlayers[winnerIndex])
        }

    }

    // const previousRound = () => {
    //     setPlayer(currPlayers => {
    //         return currPlayers.filter(currPlayer => !winners.includes(currPlayer));
    //     })

    //     console.log(player);
    // }

    // const resetMatch = async () => {


    //     try {

    //         await axios.put(`/join-event/${tournamentID}`, { action: 'reset-match' });
    //         setPlayer(initalPlayers);

    //     } catch (e) {
    //         console.error(e);
    //     }

    // }

    // console.log(player);
    const winnerCell = (winner = '', winnerID) => {

        const winnerSpotFilled = winner !== '';
        console.log('winner', winnerSpotFilled)
        return (

            <div className='bracket-cell'>
                <div className="opponent-info">
                    <div className='top-opponent' style={{
                        backgroundColor: winnerSpotFilled && (player[winnerID]?.hasWon ? '#d69729' : player[winnerID]?.hasLost ? 'red' : 'transparent'),
                        // textDecoration: player[winnerID]?.hasLost ? 'line-through' : 'none'

                    }}>
                        {winner}
                    </div>

                </div>
            </div>


        )
    }

    const bracketCell = (player1 = '', player2 = '', player1ID, player2ID) => {

        const topSpotFilled = player1 !== '';
        const bottomSpotFilled = player2 !== '';

        return (

            <div className='bracket-cell'>
                <div className="opponent-info">
                    <div className='top-opponent' style={{
                        backgroundColor: topSpotFilled && (player[player1ID]?.hasWon ? '#2a9134' : player[player1ID]?.hasLost ? '#c32f27' : 'transparent'),
                        textDecoration: player[player1ID]?.hasLost ? 'line-through' : 'none'

                    }}>
                        {player1}
                    </div>
                    {!topSpotFilled ? null : <div className="opponent-score-container">


                        {isOrganizer && <div className="decrement-score" onClick={() => decrementScore(player1ID)}> <FontAwesomeIcon icon={faCaretLeft} /> </div>
                        }
                        <div className="opponent-score"> {player[player1ID]?.playerScore} </div>
                        {isOrganizer && <div className="increment-score" onClick={() => incrementScore(player1ID)}><FontAwesomeIcon icon={faCaretRight} /> </div>
                        }

                    </div>}


                </div>


                <div className="opponent-info">
                    <div className='bottom-opponent' style={{
                        backgroundColor: topSpotFilled && (player[player2ID]?.hasWon ? '#2a9134' : player[player2ID]?.hasLost ? '#c32f27' : 'transparent'),
                        textDecoration: player[player2ID]?.hasLost ? 'line-through' : 'none'
                    }}>
                        {player2}
                    </div>

                    {!bottomSpotFilled ? null : <div className="opponent-score-container">
                        {isOrganizer && <div className="decrement-score" onClick={() => decrementScore(player2ID)}> <FontAwesomeIcon icon={faCaretLeft} /> </div>
                        }
                        <div className="opponent-score"> {player[player2ID]?.playerScore} </div>
                        {isOrganizer && <div className="increment-score" onClick={() => incrementScore(player2ID)}><FontAwesomeIcon icon={faCaretRight} /> </div>
                        }

                    </div>}


                </div>


            </div>


        )


    }

    const displayRoundCells = () => {

        const roundList = [];
        let playerIndex = 0;

        while (numPlayers >= 1) {


            const roundCells = [];

            if (numPlayers === 1) {
                roundCells.push(winnerCell(players[playerIndex], playerIndex + 1)
                )

                roundList.push(
                    <div key={uuid()} className='round-cells'>
                        {roundCells}
                    </div>
                )

                return roundList
            }

            let loopNum = Math.ceil(numPlayers / 2);

            for (let i = 0; i < loopNum; i++) {
                roundCells.push(
                    bracketCell(players[playerIndex], players[playerIndex + 1], playerIndex, playerIndex + 1)
                );
                playerIndex += 2;

            }




            roundList.push(
                <div key={uuid()} className='round-cells'>
                    {roundCells}
                </div>

            )


            numPlayers = Math.ceil(numPlayers / 2);

        }


        return roundList;
    }

    const displayRoundNumbers = () => {
        const rounds = Math.ceil(Math.log2(numPlayers)) + 1;
        const roundTitles = [];
        for (let i = 0; i < rounds; i++) {
            roundTitles.push(

                <div className='round-number'> Round {i + 1} </div>
            )
        }

        return roundTitles;

    }


    return (

        <>

            <section className="tournament-bracket" style={{ borderRadius: !isOrganizer && '15px' }} >
                <div className='rounds' >
                    {displayRoundNumbers()}
                </div>

                <div className="round-cell-container">
                    {displayRoundCells()}

                </div>
            </section>

            <div className="match-controls">

                {isOrganizer && <button className='match-control-btn' onClick={advanceRound}>Advance Round</button>
                }
                {/* <button className='match-control-btn' onClick={previousRound}>Previous Round</button> */}
                {isOrganizer && <button className='match-control-btn' onClick={() => resetClick()}>Reset Match</button>
                }


            </div>

        </>
    )
}