import React, { useEffect, useRef, useState } from 'react';
import Flickity from 'flickity';
import './past-events.css';
import './flick.css';
import axios from 'axios';
import TournamentCard from '../../CurrentEventsPage/CurrentTournaments/TournamentCard';

function PastEventsBox({ categoryName = null }) {
    const carouselRef = useRef(null);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const flkty = new Flickity(carouselRef.current, {
            cellAlign: 'left',
            wrapAround: true,
            freeScroll: true,
        });

        return () => {
            flkty.destroy();
        };
    }, [events]);

    useEffect(() => {
        if (categoryName === 'Current Events') {
            axios.get('/events/all')
                .then(response => {
                    console.log(response.data);
                    setEvents(response.data);
                })
        }
    }, [categoryName])

    return (
        <section>
            <div className="tournament-category-container">

                <h3 className='tournament-category-header'>{categoryName}</h3>
                <p className='btn view-all'>View All</p>

                {/* {events.map((event, index) => (
                    <TournamentCard key={index} data={event}/>
                ))} */}


            </div>
            <div className="multi-img-carousel" ref={carouselRef}>
                <div className="carousel_button"></div>

                {/* {events.map((event, index) => (
                    <div className='carousel_slide' key={index}>
                        <img src={event.tournamentImg} alt={event.tournamentTitle} />
                    </div>
                ))} */}

                {/* <div className="carousel_slide">
                    <TournamentCard data={events[0]}/>
                </div> */}

                <div className="carousel_slide">
                    <img src="https://upload.wikimedia.org/wikipedia/en/5/5b/Mortal_Kombat_1_key_art.jpeg" alt="" />
                </div>

                <div className="carousel_slide">
                    <img src="https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltc655d62fc92e4acd/649bdd9094be10f2698941ed/071123_Val_EP7_China_CG_Banner.jpg?auto=webp&disable=upscale&height=549" alt="" />
                </div>

                <div className="carousel_slide">
                    <img src="https://m.media-amazon.com/images/M/MV5BMjFkNjk3MjktMmU2Ny00MDlmLWE5ZTctM2Y4ZDU4YzkwMjFiXkEyXkFqcGdeQXVyMTA0MTM5NjI2._V1_.jpg" alt="" />
                </div>

                <div className="carousel_slide">
                    <img src="https://static.tweaktown.com/news/16x9/90313_report-call-of-duty-2023-will-be-full-game-with-campaign.png" alt="" />
                </div>

                <div className="carousel_button"></div>
            </div>
        </section>
    );
}

export default PastEventsBox;
