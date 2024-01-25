import './reset.css';
import './current-events-page.css';
import Navbar from "../Navbar/Navbar.js";
import CurrentTournaments from "./CurrentTournaments/CurrentTournaments.js";
import Banner from '../GameListPage/Banner/Banner';
import { useParams } from 'react-router-dom';

function CurrentEventsPage() {
    const { gameName } = useParams();

    return (
        <>
            <Navbar />
            <Banner gameName={gameName} />
            <CurrentTournaments gameName={gameName} />
        </>
    );
}

export default CurrentEventsPage;
