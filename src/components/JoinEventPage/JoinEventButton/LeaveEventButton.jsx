import './JoinEventButton.css'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react';
import { UserContextTest } from '../../Login/CurrentUserContext';
import { divide } from 'lodash';

export default function LeaveEventButton({ tournamentID, handleClick }) {

    const [totalAttendees, setTotalAttendees] = useState(0);
    const [attendeeList, setAttendeeList] = useState([]);
    const [maxPlayers, setMaxPlayers] = useState(0);
    const { currentUser, setCurrentUser } = useContext(UserContextTest);
    const [inTournament, setInTournamet] = useState(false);

    useEffect(() => {
        async function getTotalAttendees() {
            await axios.get(`/join-event/${tournamentID}`)
                .then(response => {
                    const attendeeList = response.data[0].tournamentAttendeeList;
                    setTotalAttendees(attendeeList.length);
                    setMaxPlayers(response.data[0].numPlayers);
                    setAttendeeList(attendeeList);
                })
                .catch(e => {
                    console.log('couldnt fetch number of attendees', e.response.data);
                })
        }

        getTotalAttendees();
    }, [tournamentID])



    // useEffect(() => {
    //     for (let name of attendeeList) {
    //         if (currentUser === name || currentUser === null) {
    //             setInTournamet(true);
    //             return; 
    //         }
    //     }
    //     setInTournamet(false);
    // }, [attendeeList, currentUser]);


    console.log(currentUser);
    return (
        <section className="join-event-button">

            {!inTournament ? <button className='btn join-event' onClick={() => handleClick()}>Leave Event</button>
                : <div style={{ marginBottom: '5rem' }}></div>}

        </section>

    )
}