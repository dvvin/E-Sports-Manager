import './GameCard.css'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function GameCard({ data }) {
    const navigate = useNavigate();

    const gameNavigate = () => {
        switch (data.name) {
            case "Super Smash Bros Ultimate":
                navigate('/events/Super Smash Bros Ultimate');
                break;
            case "Valorant":
                navigate('/events/Valorant');
                break;
            case "Call of Duty: MW2":
                navigate('/events/Call of Duty: MW2');
                break;
            case "Mortal Kombat 1":
                navigate('/events/Mortal Kombat 1');
                break;
            default:
                break;
        }
    }

    return (
        <Link to={gameNavigate}>
            <article className="game-card" onClick={gameNavigate}>
                <div className="game-card-image-container">
                    <img src={data.image} alt=""
                        className="game-card-image" />
                </div>

                <div className="game-card-name">
                    {data.name}
                </div>

                <div className="game-card-footer">
                    <div className="game-num-players-container">
                        <div className="game-num-players-icon-container"><span className="material-symbols-outlined">
                            groups 
                        </span>
                        </div>
                        <div className="game-num-players">{data.playerCount}</div>
                    </div>

                    <div className="game-num-tournaments-container">
                        <div className="game-num-tournaments-icon-container"><span className="material-symbols-outlined">
                            event
                        </span>
                        </div>
                        <div className="game-num-tournaments">{data.tournamentCount}</div>
                    </div>
                </div>
            </article>
        </Link>
    )
}
