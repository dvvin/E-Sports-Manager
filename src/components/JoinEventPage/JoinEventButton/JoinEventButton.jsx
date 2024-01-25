import './JoinEventButton.css'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react';
import { UserContextTest } from '../../Login/CurrentUserContext';
import { divide } from 'lodash';

export default function JoinEventButton({ tournamentID, handleClick }) {

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



    // async function handleClick() {

    //     if (totalAttendees != maxPlayers) {

    //         await axios.post(`/join-event/${tournamentID}`, { userToAdd: currentUser })
    //             .then(response => {
    //                 console.log('user added to event', response.data);
    //                 setTotalAttendees(currAttendees => currAttendees + 1);

    //             })
    //             .catch(e => {
    //                 console.log("not successful", e.response.data);
    //             })
    //     }
    // }


    return (
        <section className="join-event-button">

            {currentUser ? <button className='btn join-event' onClick={() => handleClick()}>Join Event</button>
                : <div style={{ marginBottom: '5rem' }}></div>}

        </section>

    )
}