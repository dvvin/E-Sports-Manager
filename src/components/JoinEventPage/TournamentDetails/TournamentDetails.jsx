import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TournamentDetails.css';

export default function CombinedTournamentComponent({ tournamentID }) {
    const [tournamentInfo, setTournamentInfo] = useState({});

    useEffect(() => {
        async function getTournamentInformation() {
            try {
                const response = await axios.get(`/join-event/${tournamentID}`);
                setTournamentInfo(response.data[0]);
            } catch (e) {
                console.log(e);
            }
        }

        getTournamentInformation();
    }, [tournamentID]);

    return (
        <section className="description-rules-container">
            <article className="tournament-description-container">
                <h2>Description</h2>
                <p className="description-text"> {tournamentInfo.tournamentDescription} </p>
            </article>
        <hr className='info-seperator'/>
            <article className="tournament-rule-container">
                <h2>Rules</h2>
                <p className="description-text"> {tournamentInfo.tournamentRules} </p>
            </article>
            <hr className='info-seperator'/>

            <article className="tournament-prize-container">
                <h2>Prize</h2>
                <p className="prize-text"> {tournamentInfo.tournamentPrize} </p>
            </article>
            
        </section>
    );
}
