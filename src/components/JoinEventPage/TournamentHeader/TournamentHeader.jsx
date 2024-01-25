import { useState, useEffect } from 'react';
import axios from 'axios';
import './TournamentHeader.css';

export default function TournamentHeader({ name, date, attendees, location }) {
    const [tournamentInfo, setTournamentInfo] = useState({});

    // useEffect(() => {
    //     async function getTournamentInformation() {
    //         try {
    //             const response = await axios.get(`/join-event/${tournamentID}`);
    //             setTournamentInfo(response.data[0]);
    //         } catch (e) {
    //             console.log(e);
    //         }
    //     }

    //     getTournamentInformation();
    // }, [tournamentID]);

    return (
        <section className="tournament-header-info-container">
            <h1 className="tournament-header-name">{name}</h1>
            <div className="tournament-header-details">
                <ul>
                    <li className="tournament-header-date">
                        <span className="material-symbols-outlined">event</span> {new Date(date).toLocaleDateString('en-US')}
                    </li>
                    <li className="tournament-header-attendees">
                        <span className="material-symbols-outlined">groups</span> {attendees}
                    </li>
                    <li className="tournament-header-location">
                        <span className="material-symbols-outlined">location_on</span> {location}
                    </li>
                </ul>
            </div>

        </section>
    );
}
