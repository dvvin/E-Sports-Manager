import Navbar from "../Navbar/Navbar";
import Banner from "../GameListPage/Banner/Banner";
import TournamentHeader from "./TournamentHeader/TournamentHeader";
import TournamentDetails from "./TournamentDetails/TournamentDetails";
import Attendees from "./Attendees/AttendeeList";
import JoinEventButton from "./JoinEventButton/JoinEventButton";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import './JoinEventPage.css'
import { useParams } from "react-router-dom";
import Bracket from "../TournamentBracket/Bracket";
import { UserContextTest } from "../Login/CurrentUserContext";
import LeaveEventButton from "./JoinEventButton/LeaveEventButton";
import TournamentOrganizer from "./TournamentOrganizer/TornamentOrganizer";
import LoadContent from "../Loading Page/LoadContent";
export default function JoinEventPage() {





    const { tournamentID } = useParams();

    const [numPlayers, setNumPlayers] = useState(0);
    const [attendeeList, setAttendeeList] = useState([]);
    const [originalAttendeeList, setOriginalAttendeeList] = useState([]);
    const { currentUser, setCurrentUser } = useContext(UserContextTest);
    const [inTournament, setInTournamet] = useState(false);
    const [totalAttendees, setTotalAttendees] = useState(0);
    const [tournamentFull, setTournametFull] = useState(false);
    const [organizer, setOrganizer] = useState({ organizerName: null, organizerProfilePic: null });
    const [tournamentInfo, setTournamentInfo] = useState([])
    const [hasStarted, setHasStarted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState('');
    function checkFull() {
        setTournametFull(totalAttendees === numPlayers);

    }


    // this function gathers the tournament organizers user name and profile image
    async function getOrganizerInformation() {

        // gather organizer's username
        const response = await axios.get(`/join-event/${tournamentID}`);
        const organizerUserName = response.data[0].organizerUserName;

        // gather organizer's profile picture
        const organizerQueryResponse = await axios.get(`/user/${organizerUserName}`);
        const organizerProfilePicture = organizerQueryResponse.data.user.profilePicture;

        // set organizers username and profile picture
        setOrganizer({

            organizerProfilePic: organizerProfilePicture,
            organizerName: organizerUserName
        })

    }

    async function getTotalAttendees() {

        try {

            const response = await axios.get(`/join-event/${tournamentID}`);
            setTotalAttendees(response.data[0].tournamentAttendees);
            setNumPlayers(response.data[0].numPlayers);
            setTournamentInfo(response.data[0]);
            setHasStarted(response.data[0].hasStarted)

        } catch (e) {
            console.log('couldnt fetch number of attendees', e.response.data);


        }
    }

    const buildBracket = async () => {
        try {
            const response = await axios.get(`/join-event/${tournamentID}`);
            const attendeeNames = response.data[0].tournamentAttendeeList.map(attendee => attendee.name);
            const originalAttendeeNames = response.data[0].startingAttendeeList.map(attendee => attendee.name);
            console.log('attendee names', attendeeNames);
            setAttendeeList(attendeeNames);
            setOriginalAttendeeList(originalAttendeeNames);
            setNumPlayers(response.data[0].numPlayers)

        } catch (e) {
            console.log('Could not fetch players', e);
        }

    }



    // this use effect checks if the tournament is currently full
    useEffect(() => {
        checkFull();

        console.log('full', tournamentFull);
        console.log('in', inTournament);
    }) // leaving empty for now join data is not fetched is i put depenency


    async function loadJoinEventPage() {

        await getOrganizerInformation();
        await getTotalAttendees();
        setIsLoading(false);
        await buildBracket();

    }

    // this use effect get tournament Information and builds bracket
    useEffect(() => {
        loadJoinEventPage();
    }, [tournamentID])

    // this use effect checks if currentUser is in the tournament
    useEffect(() => {
        for (let name of attendeeList) {
            if (currentUser === name) {
                setInTournamet(true);
                return;
            }
        }

        console.log('the current user is', currentUser);
        setInTournamet(false);
    }, [attendeeList, currentUser]);


    const leaveEvent = async () => {

        const response = await axios.get(`/join-event/${tournamentID}`);
        const currentAttendees = response.data[0].tournamentAttendeeList.map(attendee => attendee.name);
        for (let attendee of currentAttendees) {
            if (currentUser === attendee) {
                setAttendeeList(currentAttendees.filter(user => user !== currentUser));
                setOriginalAttendeeList(currentAttendees.filter(user => user !== currentUser))

            }
        }
        setTotalAttendees(currAttendees => currAttendees -= 1);

        try {
            await axios.delete(`/join-event/${tournamentID}`, { data: { userToDelete: currentUser } });
            console.log('User removed from tournament');

        } catch (e) {
            console.log('error', e);
        }
    }

    const joinEvent = async () => {

        if (totalAttendees !== numPlayers) {
            await axios.post(`/join-event/${tournamentID}`, { userToAdd: currentUser })
                .then(response => {
                    console.log('user added to event', response.data);
                    setTotalAttendees(currAttendees => currAttendees + 1);

                })
                .catch(e => {
                    console.log("not successful", e.response.data);
                })

            setAttendeeList([...attendeeList, currentUser]);
            setOriginalAttendeeList([...attendeeList, currentUser])
            checkFull();

        }

    }

    const resetMatch = async () => {

        try {
            await axios.put(`/join-event/${tournamentID}`, { action: 'reset-match' });
            setAttendeeList(currList => currList = originalAttendeeList);
            loadJoinEventPage();
            setHasStarted(false);
        } catch (e) {
            console.log('Error: Could not Reset Match')
        }

    }

    const handleAdvanceRound = () => {
        console.log('callback');
        setHasStarted(true);
    }
    console.log('total attendees', totalAttendees)
    console.log('hasStarted', hasStarted);



    // this function generates loading text for this page


    return (


        <>

            <Navbar />
            <Banner tournamentID={tournamentID} />

            {!isLoading ? <>
                <TournamentHeader
                    name={tournamentInfo.tournamentTitle}
                    date={tournamentInfo.tournamentStartDate}
                    attendees={totalAttendees}
                    location={tournamentInfo.tournamentLocation} />

                <TournamentOrganizer name={organizer.organizerName} profileImage={organizer.organizerProfilePic} />
                <section className="bracket-display">
                    <Bracket numPlayers={numPlayers} players={attendeeList} pointsToWin={tournamentInfo.tournamentMaxScore} tournamentID={tournamentID} resetClick={resetMatch} onAdvanceRound={handleAdvanceRound} />
                </section>

                {!hasStarted && !inTournament && (!tournamentFull ? <JoinEventButton tournamentID={tournamentID} handleClick={joinEvent} />
                    : <div style={{ marginBottom: '5rem' }}></div>)}

                {!hasStarted && inTournament && <LeaveEventButton tournamentID={tournamentID} handleClick={leaveEvent} />
                }

                <hr className="bracket-description-seperator" />

                <section className="tournament-information">
                    <section className="desc-rules-attendee-list-container">
                        <TournamentDetails tournamentID={tournamentID} className="tournament-details" />
                        <Attendees attendeeList={originalAttendeeList} />
                    </section>

                </section></> : <section className="load-join-page-container"><LoadContent icon={'gamepad'} loadingMessage={'Loading Tournament'} /></section>}



        </>
    )
}