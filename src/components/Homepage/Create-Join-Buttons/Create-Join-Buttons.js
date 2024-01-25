import { Link } from 'react-router-dom';
import './create-join-buttons.css'

function CreateJoinButtons() {
    return (
        <section>
            <div className="create-join-event-container">
                <Link to="/create-events"><button className="page-button-homepage">Create Event</button></Link>
                <Link to="/game-list"><button className="page-button-homepage">Join Event</button></Link>
            </div>
        </section>
    );
}

export default CreateJoinButtons;
