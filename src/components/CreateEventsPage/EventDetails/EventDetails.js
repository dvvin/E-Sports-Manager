import './create-events.css'
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContextTest } from '../../Login/CurrentUserContext';

export default function CreateEventsForm() {
    const [tournamentFormData, setTournamentFormData] =
        useState({
            tournamentImg: "",
            tournamentGame: "Super Smash Bros Ultimate",
            tournamentTitle: "",
            tournamentLocation: "",
            tournamentSignUpStartDate: "",
            tournamentSignUpEndDate: "",
            tournamentStartDate: "",
            tournamentEndDate: "",
            numPlayers: "",
            bracketType: "single elimination",
            tournamentStartTime: "",
            tournamentDescription: "",
            tournamentPrize: "",
            tournamentRules: "",
            organizerEmail: "",
            organizerPhoneNum: "",
            tournamentMaxScore: ""
        })

    const [toggleForm, setToggleForm] = useState(false);
    const { currentUser, setCurrentUser } = useContext(UserContextTest);
    console.log('current user is: ', currentUser);
    const navigate = useNavigate();
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        } else {
            navigate('/create-events');
        }
    }, [])


    const handleSubmit = async (evt) => {
        evt.preventDefault();

        const startDate = new Date(tournamentFormData.tournamentStartDate);
        const endDate = new Date(tournamentFormData.tournamentEndDate);
        const signUpStartDate = new Date(tournamentFormData.tournamentSignUpStartDate);
        const signUpEndDate = new Date(tournamentFormData.tournamentSignUpEndDate);
        const organizerUserName = currentUser;

        const formDataWithDates = {
            ...tournamentFormData,
            tournamentStartDate: startDate,
            tournamentEndDate: endDate,
            tournamentSignUpStartDate: signUpStartDate,
            tournamentSignUpEndDate: signUpEndDate,
            organizerUserName: organizerUserName,
        };

        console.log(tournamentFormData)

        await axios.post('/events', formDataWithDates)
            .then(response => {
                console.log('tournament added', response.data);
            })
            .catch(e => {
                console.log("not successful", e.response.data);

            })
    }

    const handleData = (evt) => {
        const fieldName = evt.target.name;
        const newValue = evt.target.value;

        setTournamentFormData(currData => {
            return {
                ...currData,
                [fieldName]: newValue
            };
        })
    }

    const nextForm = (evt) => {
        evt.preventDefault();
        setToggleForm(!toggleForm)
    }

    return (
        <div className='event-container'>
            <form>
                {!toggleForm ? (
                    <>
                        {/* first form */}
                        {/* ----------------------------------------- */}
                        {/* get this to work eventually!! */}
                        <legend className='create-event-section-label'>Create Event</legend>
                        <label htmlFor="img">Upload Tournament Banner Image:</label>

                        <input
                            type='text'
                            placeholder='enter image url'
                            id="img"
                            name="tournamentImg"
                            onChange={handleData}
                        ></input>

                        {/* <input
                            type="file"
                            id="img"
                            name="tournamentImg"
                            // value={tournamentFormData.tournamentImg}
                            onChange={handleImageUpload}
                            accept='image/*' /> */}
                        {/* ---------------------------------------- */}

                        <img src={tournamentFormData.tournamentImg ? tournamentFormData.tournamentImg : null}></img>
                        <label htmlFor="tournamentTitle">Event Title:</label>
                        <input
                            type="text"
                            name="tournamentTitle"
                            id='tournamentTitle'
                            value={tournamentFormData.tournamentTitle}
                            onChange={handleData}
                            required
                        />

                        <legend className='create-event-section-label'>Contact Details: </legend>
                        <label htmlFor='organizerEmail'>Email:</label>
                        <input
                            type='Email'
                            name="organizerEmail"
                            id='organizerEmail'
                            value={tournamentFormData.organizerEmail}
                            onChange={handleData}
                            required
                        />

                        <label htmlFor='organizerPhoneNum'>Phone:</label>
                        <input
                            type='text'
                            name="organizerPhoneNum"
                            id='organizerPhoneNum'
                            value={tournamentFormData.organizerPhoneNum}
                            onChange={handleData}
                        />

                        <legend className='create-event-section-label'>Registration Dates:</legend>
                        <label htmlFor='tournamentSignUpStartDate'>Sign Up Start Date:</label>
                        <input
                            type='date'
                            name='tournamentSignUpStartDate'
                            id='tournamentSignUpStartDate'
                            value={tournamentFormData.tournamentSignUpStartDate}
                            onChange={handleData}
                        />

                        <label htmlFor='tournamentSignUpEndDate'>Last Day Sign Up:</label>
                        <input
                            type='date'
                            name='tournamentSignUpEndDate'
                            id='tournamentSignUpEndDate'
                            value={tournamentFormData.tournamentSignUpEndDate}
                            onChange={handleData}
                        />

                        <div className='create-event-btn-container'>
                            <button
                                className='page-button'
                                onClick={nextForm}>Next</button>
                        </div>
                    </>

                ) : (<>

                    {/* second form */}

                    <legend className='create-event-section-label'>Tournament Details: </legend>
                    <label htmlFor='tournamentGame'>Select A Game:</label>
                    <select
                        name='tournamentGame'
                        id='tournamentGame'
                        value={tournamentFormData.tournamentGame}
                        onChange={handleData}>
                        <option value="Super Smash Bros Ultimate">Super Smash Bros Ultimate</option>
                        <option value="Mortal Kombat 1">Mortal Kombat 1</option>
                        <option value="OW2">Overwatch 2</option>
                        <option value="Valorant">Valorant</option>
                        <option value="RL">Rocket League</option>
                        <option value="Call of Duty: MW2">Call of Duty: MW2</option>
                    </select>

                    <label htmlFor='numPlayers'>How many Teams / Players:</label>
                    <input
                        type='number'
                        name='numPlayers'
                        id='numPlayers'
                        value={tournamentFormData.numPlayers}
                        onChange={handleData}
                    />

                    <label for="tournamentMaxScore">Enter Rounds Required to Win:</label>
                    <input
                        type="number"
                        name='tournamentMaxScore'
                        id='tournamentMaxScore'
                        value={tournamentFormData.tournamentMaxScore}
                        onChange={handleData}
                    />

                    <label htmlFor='bracketType'>Type of Bracket:</label>
                    <select
                        name='bracketType'
                        id='bracketType'
                        value={tournamentFormData.bracketType}
                        onChange={handleData}>
                        <option value='single elimination'>Single Elimination</option>
                        <option value='double elimination'>Double Elimination</option>
                        <option value='round robin'>Round Robin</option>
                    </select>

                    <label htmlFor='tournamentPrize'>Commission / Prizes:</label>
                    <textarea
                        type='number'
                        name='tournamentPrize'
                        id='tournamentPrize'
                        value={tournamentFormData.tournamentPrize}
                        onChange={handleData}
                        rows={12}>
                    </textarea>

                    <label htmlFor='tournamentDescription'>Description:</label>
                    <textarea
                        name='tournamentDescription'
                        id='tournamentDescription'
                        value={tournamentFormData.tournamentDescription}
                        onChange={handleData}
                        rows={12}>
                    </textarea>

                    <label htmlFor='tournamentRules'>Rulset:</label>
                    <textarea
                        name='tournamentRules'
                        id='tournamentRules'
                        value={tournamentFormData.tournamentRules}
                        onChange={handleData}
                        rows={12}>
                    </textarea>

                    <label htmlFor='tournamentLocation'>Location:</label>
                    <input
                        type='text'
                        id='tournamentLocation'
                        name='tournamentLocation'
                        value={tournamentFormData.tournamentLocation}
                        onChange={handleData}
                    />

                    <label htmlFor='tournamentStartTime'>Start Time:</label>
                    <input
                        type='time'
                        id='tournamentStartTime'
                        name='tournamentStartTime'
                        value={tournamentFormData.tournamentStartTime}
                        onChange={handleData}
                    />

                    <label htmlFor='tournamentStartDate'>Start Date:</label>
                    <input
                        type='date'
                        id='tournamentStartDate'
                        name='tournamentStartDate'
                        value={tournamentFormData.tournamentStartDate}
                        onChange={handleData}
                    />

                    <label htmlFor='tournamentEndDate'>End Date:</label>
                    <input
                        type='date'
                        id='tournamentEndDate'
                        name='tournamentEndDate'
                        value={tournamentFormData.tournamentEndDate}
                        onChange={handleData}
                    />

                    <div className='create-event-btn-container'>
                        <button
                            className='page-button'
                            onClick={nextForm}>Previous</button>
                        <button className='page-button' onClick={handleSubmit}>Submit</button>
                    </div>
                </>)}
            </form>
        </div>
    );
}
