import './create-tournament.css'
import { Link } from 'react-router-dom';
export default function TournamentDetails() {
    return (
        <div className='tournament-container'>
            <form>
                <label htmlFor='games'>Select A Game:</label>
                <select name='listgames' id='games'>
                    <option value="SSBU">Super Smash Bros Ultimate</option>
                    <option value="MK1">Mortal Kombat 1</option>
                    <option value="OW2">Overwatch 2</option>
                    <option value="VAL">Valorant</option>
                    <option value="RL">Rocket League</option>
                </select>

                <label htmlFor='ruleset'>Rulset:</label>
                <select name='gameRulesets' id='ruleset'>

                </select>

                <label htmlFor='numPlayers'>How many players:</label>
                <input type='number' name='players' id='numPlayers' />

                <label htmlFor='bracket-type'>Type of Bracket:</label>
                <select name='brackets' id='bracket-type'>

                </select>

                <label htmlFor='commission'>Commission:</label>
                <input type='number' name='commission' id='commission' />

                <label htmlFor='local'>Location:</label>
                <input type='text' id='local' name='local' />


                <label htmlFor='start'>Start Time:</label>
                <input type='time' id='start' name='start' />

                <label htmlFor='desc'>Description:</label>
                <input type='text' id='desc' name='desc' />

                <div className='create-event-btn-container'>
                    <Link to='/create-events'><button className='page-button'>Previous</button></Link>
                    <button className='page-button'>Submit</button>
                </div>
            </form>
        </div>

    );
}