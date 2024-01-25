import './TournamentOrganizer.css'
import { useNavigate } from 'react-router-dom';
export default function TournamentOrganizer({ name, profileImage }) {

    const navigate = useNavigate();

    const handleClick = (username) => {
        const profileLink = `/user/${name}`;
        navigate(profileLink);
    }


    return (
        
        <div className="organizer-info-container">
            <div className="organizer-header-container">
                <h2>Organized By: </h2>
            </div>
            <div className="organizer-profile-image-container">
                <img src={profileImage} alt="" className="organizer-profile-image" onClick={handleClick} />
                <p>{name}</p>

            </div>
        </div>
    )
}