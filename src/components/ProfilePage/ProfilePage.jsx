import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import TournamentCard from "../CurrentEventsPage/CurrentTournaments/TournamentCard";
import ProfileSettings from "./ProfileSettingsPage/ProfileSettingsPage";
import './ProfilePage.css';
import { UserContextTest } from "../Login/CurrentUserContext";
import axios from "axios";

export default function ProfilePage() {
    const [userTournaments, setUserTournaments] = useState([]); // array of tournaments
    const [userNotFound, setUserNotFound] = useState(false); // for when the user is not found
    const { username } = useParams(); // the username of the profile page
    const [profilePageInfo, setProfilePageInfo] = useState({}) // holds the profile page info
    const [isEditMode, setIsEditMode] = useState(false); // for when the user is editing their profile

    const { currentUser, setCurrentUser } = useContext(UserContextTest); // the current user
    const isLoggedIn = !!localStorage.getItem('token'); // if the user is logged in
    const getUsername = currentUser?.username || localStorage.getItem('username'); // the username of the current user

    const fetchProfile = async () => {
        try {
            const profileData = await axios.get(`/user/${username}`); // get the profile data
            setProfilePageInfo(profileData.data.user); // set the profile page info
            setUserTournaments(profileData.data.user.tournamentsAttending); // set the user's tournaments
        } catch (e) {
            console.error('Error', e);
            setUserNotFound(true);
        }
    };

    useEffect(() => {
        fetchProfile(); // fetch the profile data
    }, [username]);

    const handleEditBackgroundClick = () => { // when the user clicks the edit background button
        setIsEditMode(true); // set edit mode to true
    };

    const exitEditMode = () => { // when the user exits edit mode
        setIsEditMode(false); // set edit mode to false
        fetchProfile(); // fetch the profile data
    }

    if (userNotFound) { // if the user is not found
        return (
            <>
                <Navbar />
                <div className="error-message">
                    <h1>User Not Found</h1>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <>
                {isEditMode ? (
                    <ProfileSettings
                        username={username}
                        initialData={profilePageInfo}
                        onExitEditMode={exitEditMode}
                    />
                ) : (
                    <>
                        <section className="profile-images-container">
                            <div className="profile-background-image">
                                <img src={profilePageInfo.profileBackground} alt="background" />

                                {isLoggedIn && getUsername === username && (
                                    <button
                                        className="btn-edit-profile-background"
                                        onClick={handleEditBackgroundClick}
                                    >
                                        Edit Settings
                                    </button>
                                )}
                            </div>
                        </section>

                        <section>
                            <div className="profile-picture-container-profile-page">
                                <img src={profilePageInfo.profilePicture} alt="profile picture" />
                            </div>
                            <div className="username-display">{username}</div>
                            <hr className="profile-break" />
                        </section>

                        <section className="profile-main-page-wrapper">
                            <h2 className="about-me-header">About Me:</h2>
                            <section className="about-me-container">
                                <div className="about-me">{profilePageInfo.bio}</div>
                            </section>

                            <section className="my-tournaments-section">
                                <h2 className="my-tournaments-label">My Tournaments: </h2>
                                <section className="my-tournaments-container">
                                    {userTournaments.map((game, index) => (
                                        <TournamentCard key={index} data={game} />
                                    ))}
                                </section>
                            </section>

                            <section className="profile-stats-section">
                                <h2 className="profile-stats-header">Stats:</h2>
                                <section className="profile-stats">
                                    <p className="tournaments-entered">Tournaments Entered: <span className="tournaments-entered-num">{profilePageInfo.tournamentsEntered}</span>
                                    </p>
                                    <p className="tournaments-won">Tournaments Won: <span className="tournaments-won-num">{profilePageInfo.tournamentsWon}
                                    </span></p>
                                </section>
                            </section>
                        </section>
                    </>
                )}
            </>

        </>
    );
}
