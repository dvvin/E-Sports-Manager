import { Link } from 'react-router-dom';
import axios from "axios"
import { useState, useEffect } from "react"
import './EventBox.css'
import TournamentCard from "../../CurrentEventsPage/CurrentTournaments/TournamentCard";

import LoadContent from '../../Loading Page/LoadContent';
export default function EventBox({ categoryName = null }) {

    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (categoryName === 'Recently Added') {
            axios.get('/events/all')
                .then(response => {
                    console.log(response.data);
                    setEvents(response.data);
                    setIsLoading(false);
                })
                .catch(e => {
                    console.log(e.message);
                    setIsLoading(true);
                })
        }
    }, [categoryName])



    return (
        <section className="event-box-container">
            {!isLoading ? <><div className="tournament-category-container">

                <h3 className='tournament-category-header'>{categoryName}</h3>
                <Link to={'/events/all'} style={{ textDecoration: 'none' }}>
                    <a className='btn view-all'>View All</a>

                </Link>
            </div>

                <div className="tournament-card-display">

                    {events.slice(-4).map((event, index) => (
                        <TournamentCard key={index} data={event} />
                    ))}

                </div> </> :
                <>
                    <div className="tournament-category-container">

                        <h3 className='tournament-category-header'>{categoryName}</h3>
                        <Link to={'/events/all'} style={{ textDecoration: 'none' }}>
                            <a className='btn view-all'>View All</a>

                        </Link>
                    </div>
                    <LoadContent loadingMessage={'Loading Content'} />

                </>}



        </section>
    )
}