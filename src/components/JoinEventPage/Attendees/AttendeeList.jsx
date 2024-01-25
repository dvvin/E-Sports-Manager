import Attendee from './Attendee'
import { useEffect, useState } from 'react';
import './AttendeeList.css'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
export default function AttendeeList({ attendeeList }) {

    const navigate = useNavigate();

    const [attendees, setAttendees] = useState([]);
    useEffect(() => {

        async function getAttendees() {
            try {
                const newAttendee = await Promise.all(
                    attendeeList.map(async (attendee) => {
                        const response = await axios.get(`/user/${attendee}`);
                        return response.data.user;

                    })
                    

                );

                setAttendees(newAttendee)



            } catch (e) {
                console.log(e);
            }

        }

        getAttendees();

    }, [attendeeList])

    const handleClick = (username) => {
        const profileLink = `/user/${username}`;
        navigate(profileLink);
    }


    return (

        <section className="attendee-list-container">
            <h2>Attendee List</h2>
            <section className="attendee-list">
                {attendees.map((attendee, index) => (

                    // fetch for profile picture based on username
                    <Attendee
                        key={attendee.username}
                        username={attendee.username}
                        profileImage={attendee.profilePicture}
                        handleClick={handleClick} />
                ))}
            </section>
        </section>

    )

}