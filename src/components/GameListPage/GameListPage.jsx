import React, { useState } from 'react';
import Navbar from "../Navbar/Navbar.js";
import './GameListPage.css'
import Banner from "./Banner/Banner.jsx";
import BrowseGameSubHeader from "./BrowseGamesSubHeader/BrowseGameSubHeader.jsx";
import GameCardSection from "./GameCard/GameCardSection.jsx";

export default function GameListPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("playerCountASC");

    return (
        <>
            <Navbar />
            <Banner
                imageLink={'https://assets.bwbx.io/images/users/iqjWHBFdfxIU/isBqQ09k04Mc/v1/-1x-1.jpg'}
                bannerText={'Browse Games'}
            />
            <BrowseGameSubHeader setSearchTerm={setSearchTerm} setSortBy={setSortBy} />
            <GameCardSection searchTerm={searchTerm} sortBy={sortBy} />
        </>
    )
}
