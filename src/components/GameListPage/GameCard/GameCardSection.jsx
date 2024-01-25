import GameCard from "./GameCard";
import { useState, useEffect } from "react";
import axios from "axios";
import LoadContent from "../../Loading Page/LoadContent";


export default function GameCardSection({ searchTerm, sortBy }) {
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        axios.get('http://localhost:4000/games')
            .then((response) => {
                setGames(response.data);
                console.log(response.data)
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(true);
            })
    }, [])

    let filteredGames = games.filter(game => game.name.toLowerCase().startsWith(searchTerm.toLowerCase()))

    switch (sortBy) {
        case "playerCountASC":
            filteredGames.sort((a, b) => b.playerCount - a.playerCount);
            break;
        case "playerCountDESC":
            filteredGames.sort((a, b) => a.playerCount - b.playerCount);
            break;
        case "tournamentCountASC":
            filteredGames.sort((a, b) => b.tournamentCount - a.tournamentCount);
            break;
        case "tournamentCountDESC":
            filteredGames.sort((a, b) => a.tournamentCount - b.tournamentCount);
            break;
        default:
            filteredGames.sort((a, b) => b.playerCount - a.playerCount);
            break;
    }

    return (
        <>
            {!isLoading ? <section className="game-cards-section">
                {filteredGames.map((game, index) => (
                    <GameCard key={index} data={game} />
                ))}
            </section> : <section className="game-cards-section">
                <LoadContent loadingMessage={'Loading Games'} />
            </section>}

        </>
    )
}
