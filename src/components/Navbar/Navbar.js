import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useContext, useState, useEffect } from 'react';
import { UserContextTest } from '../Login/CurrentUserContext';
import axios from 'axios';
import './navbar.css';
import './reset.css';

function Navbar() {
    const { currentUser, setCurrentUser } = useContext(UserContextTest);
    const isLoggedIn = !!localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    const username = currentUser?.username || localStorage.getItem('username'); // get username from localStorage if currentUser is null
    const [userProfilePic, setUserProfilePic] = useState(null);

    const isFullUrl = (url) => {
        return url.startsWith('http://') || url.startsWith('https://');
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`/user/${username}`);
                const { user, defaultProfilePic } = response.data;

                let userProfilePicURL = user && user.profilePicture ? user.profilePicture : defaultProfilePic;
                userProfilePicURL = isFullUrl(userProfilePicURL) ? userProfilePicURL : `http://localhost:4000${userProfilePicURL}`;

                setUserProfilePic(userProfilePicURL);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        if (username) {
            fetchUserProfile();
        }
    }, [currentUser, username]);

    // when user clicks logout button, remove token from localStorage and set currentUser to null
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        setCurrentUser(null);
        window.location.reload();
    };

    return (
        <header>
            <nav className="navbar">
                <Link to="/">
                    <div className="nav-site-logo-container">
                        <img
                            src="https://www.pngkey.com/png/detail/141-1416946_logos-what-is-a-generic-logo-transparent-background.png"
                            alt="site logo"
                        />
                    </div>
                </Link>

                <div className="nav-site-name"></div>
                <div className="nav-links">
                    {isLoggedIn ? (
                        <ul className="nav-signed-in-items">
                            <li>
                                <Link to={`/user/${username}`}>
                                    {userProfilePic ? (
                                        <img src={userProfilePic} alt="User" className="navbar-profile-pic" />
                                    ) : (
                                        <FontAwesomeIcon icon={faUserCircle} size="2x" className="navbar-icon" />
                                    )}
                                </Link>

                                {/* <button>{`Role is: ${userRole}`} </button> */}
                                <button onClick={handleLogout}>Log Out</button>
                            </li>
                        </ul>
                    ) : (
                        <ul className="nav-signed-out-items">
                            <li>
                                <Link to="/login">
                                    <button>Log In</button>
                                </Link>
                            </li>
                        </ul>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
