import { useNavigate } from 'react-router-dom';
import './tournament-card.css'
import axios from 'axios';
import { useContext } from 'react';
import { UserContextTest } from '../../Login/CurrentUserContext';


function TournamentCard({ data }) {
    const { currentUser, setCurrentUser } = useContext(UserContextTest);
    const navigate = useNavigate();

    const goToJoinPage = () => {
        navigate(`/join-event/${data._id}`)
    }




    return (
        <article className="tournament-card" onClick={goToJoinPage}>
            <div className="tournament-card-header">
                <div className="tournament-card-image">
                    <img src={data.tournamentImg} alt="tournament" />
                </div>
                <div className="tournament-card-title">{data.tournamentTitle}</div>
            </div>

            <div className="tournament-card-info">
                <ul>
                    <li className="tournament-card-date">
                        <span className="material-symbols-outlined">event</span> {new Date(data.tournamentStartDate).toLocaleDateString('en-US')}
                        {/* above line of code gets date data from database and converts it to match (yyyy-mm-dd) format */}
                    </li>
                    <li className="tournament-card-attendees">
                        <span className="material-symbols-outlined">groups</span> {data.tournamentAttendees}
                    </li>
                    <li className="tournament-card-location">
                        <span className="material-symbols-outlined">location_on</span> {data.tournamentLocation}
                    </li>
                </ul>
            </div>
        </article>
    );
}

export default TournamentCard;
