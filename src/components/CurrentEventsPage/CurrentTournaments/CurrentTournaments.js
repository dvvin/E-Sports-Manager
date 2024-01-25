import TournamentCard from './TournamentCard';
import axios from 'axios';
import { useEffect, useState } from 'react';
import './CurrentTournaments.css'
import LoadContent from '../../Loading Page/LoadContent';
function CurrentTournaments({ gameName }) {

    const [gameTournaments, setGameTournaments] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        async function getTournaments() {

            const response = await axios.get(`http://localhost:4000/events/${gameName}`)

            if (gameName === 'all') {
                setGameTournaments(response.data);
                setIsLoading(false);

            } else {
                setGameTournaments(response.data.tournamentData);
                setIsLoading(false);

            }
        }
        getTournaments();
    }, [gameName])


    return (
        <>
            <section className='current-tournaments-label'>Current <span className="game-name">{gameName === 'all' ? null : gameName} </span>Tournaments </section>

            {!isLoading ?
                <>
                    <section className="current-tournaments-section">
                        <section className="current-tournaments-container">
                            {gameTournaments.map((tournament, index) => (
                                <TournamentCard key={index} data={tournament} />
                            ))}
                        </section>
                    </section>
                </>
                :
                <LoadContent loadingMessage={'Loading Content'} />}

        </>

    );
}

export default CurrentTournaments;
