import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useContext } from 'react';
import { UserContextTest } from '../../Login/CurrentUserContext';
import './ProfileSettingsPage.css';
import { set } from 'lodash';

export default function ProfileSettings({ username, initialData, onExitEditMode }) {
    const [userData, setUserData] = useState({ // State for the user data
        username: initialData.username || '',
        email: initialData.email || '',
        bio: initialData.bio || ''
    });

    const [profilePicture, setProfilePicture] = useState(null); // State for the profile picture
    const [profileBackground, setProfileBackground] = useState(null); // State for the profile background
    const [profilePicturePreview, setProfilePicturePreview] = useState(null); // State for the profile picture preview
    const [profileBackgroundPreview, setProfileBackgroundPreview] = useState(null); // State for the profile background preview
    const [defaultProfilePic, setDefaultProfilePic] = useState(null); // State for the default profile picture
    const [defaultProfileBackground, setDefaultProfileBackground] = useState(null); // State for the default profile background

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`/user/${username}`);
            const { user, defaultProfilePic, defaultProfileBackground } = response.data;

            // Now set your state with this data
            setUserData(user);
            setProfilePicturePreview(user.profilePicture ? `${user.profilePicture}` : defaultProfilePic);
            setProfileBackgroundPreview(user.profileBackground ? `${user.profileBackground}` : defaultProfileBackground);
            setDefaultProfilePic(response.data.defaultProfilePic);
            setDefaultProfileBackground(response.data.defaultProfileBackground);

        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [username]);

    // Refs for file inputs
    const profilePictureInputRef = useRef(null);
    const profileBackgroundInputRef = useRef(null);

    // Handle profile picture changes
    const handleProfilePictureChange = (event) => {
        if (event.target.files[0]) { // If a file has been selected
            setProfilePicture(event.target.files[0]); // Update the state
            setProfilePicturePreview(URL.createObjectURL(event.target.files[0])); // Update the preview
        }
    };

    // Handle profile background changes
    const handleProfileBackgroundChange = (event) => {
        if (event.target.files[0]) { // If a file has been selected
            setProfileBackground(event.target.files[0]); // Update the state
            setProfileBackgroundPreview(URL.createObjectURL(event.target.files[0])); // Update the preview
        }
    };

    // Trigger file input click
    const triggerProfilePictureInput = () => {
        profilePictureInputRef.current.click();
    };

    // Trigger file input click
    const triggerProfileBackgroundInput = () => {
        profileBackgroundInputRef.current.click();
    };

    // Handle deleting the profile picture
    const handleDeleteProfilePicture = () => {
        // Update the preview to the default profile picture
        setProfilePicturePreview(defaultProfilePic);

        // Update the state
        setEditedData({ ...editedData, profilePicture: defaultProfilePic, profilePictureDeleted: true });
    };

    // Handle deleting the profile background
    const handleDeleteProfileBackground = async () => {
        // Update the preview to the default profile background
        setProfileBackgroundPreview(defaultProfileBackground);

        // Update the state
        setEditedData({ ...editedData, profileBackground: defaultProfileBackground, profileBackgroundDeleted: true });
    };

    // Handle deleting the user account
    const handleDeleteAccount = async () => {
        const isConfirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");

        if (isConfirmed) { // If the user confirms the action
            try {
                const response = await axios.delete(`/user/${username}`, { data: { deleteAccount: true } });
                alert("Your account has been successfully deleted.");

                // Clear user data from localStorage
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                localStorage.removeItem('username');

                // Set currentUser to null
                setCurrentUser(null);

                // Redirect to homepage
                navigate('/');

                console.log(response.data.message);
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    // Edited data state should be a separate state
    const [editedData, setEditedData] = useState({ ...userData }); // State for the edited data

    useEffect(() => {
        // Update both userData and editedData when initialData changes
        setUserData({
            username: initialData.username || '',
            email: initialData.email || '',
            bio: initialData.bio || ''
        });

        setEditedData({
            username: initialData.username || '',
            email: initialData.email || '',
            bio: initialData.bio || ''
        });

    }, [initialData]); // Run this effect when initialData changes

    const { setCurrentUser } = useContext(UserContextTest); // Get setCurrentUser from context
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        // Create a FormData object to handle file uploads and edited fields
        const formData = new FormData();

        // Always append the unchanged fields along with the changed ones
        formData.append('username', editedData.username);
        formData.append('email', editedData.email);
        formData.append('bio', editedData.bio);

        // Append files only if they have been selected
        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }

        if (profileBackground) {
            formData.append('profileBackground', profileBackground);
        }

        try {
            // Make an axios PUT request with formData
            const response = await axios.put(`/user/${username}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Update the state and UI based on the response
            if (response.data && response.data.user) {
                setUserData(response.data.user); // Update the user data

                // Update the preview images
                setProfilePicturePreview(`http://localhost:4000${response.data.user.profilePicture}`);
                setProfileBackgroundPreview(`http://localhost:4000${response.data.user.profileBackground}`);

                // Update the default images
                if (editedData.profilePictureDeleted) {
                    await axios.delete(`/user/${username}`, { data: { profilePicture: true } });
                }
                if (editedData.profileBackgroundDeleted) { // If the profile background has been deleted
                    await axios.delete(`/user/${username}`, { data: { profileBackground: true } }); // Delete the profile background
                }

                if (userData.username !== response.data.user.username) { // If the username has been changed
                    localStorage.setItem('username', response.data.user.username); // Update localStorage
                    setCurrentUser(response.data.user); // Update the current user in context
                }
            }

            // Exit edit mode and possibly refresh the data
            onExitEditMode();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <form className="edit-profile-information-section" onSubmit={handleUpdateProfile}>
            <h1 className="profile-settings-header">Settings</h1>

            <section className="edit-profile-picture-section">
                <h2 className="edit-profile-picture-header">Profile Picture</h2>
                <div className="profile-picture-settings-panel-container">
                    <div className="profile-picture-container">
                        <img
                            src={profilePicturePreview}
                            alt="profile picture"
                            className="profile-picture"
                        />
                    </div>
                    <div className="upload-profile-picture-container">
                        <div className="upload-profile-picture-buttons-container">
                            <input
                                type="file"
                                ref={profilePictureInputRef}
                                onChange={handleProfilePictureChange}
                                style={{ display: 'none' }}
                            />
                            <button
                                className="btn upload-profile-picture"
                                onClick={triggerProfilePictureInput}
                                type="button"
                            >
                                Upload
                            </button>
                            <button
                                className="delete-profile-picture"
                                onClick={handleDeleteProfilePicture}
                                type="button"
                            >
                                <span className="material-symbols-outlined">
                                    delete
                                </span>
                            </button>
                        </div>
                        <p className="profile-picture-upload-text">Upload or Delete Profile Picture.</p>
                    </div>
                </div>
            </section>

            <section className="edit-profile-banner-section">
                <h2 className="edit-profile-banner-header">Profile Background</h2>
                <div className="edit-profile-banner-panel">
                    <div className="profile-banner-container">
                        <img
                            src={profileBackgroundPreview}
                            alt="profile background"
                        />
                    </div>
                    <div className="upload-banner-container">
                        <div className="upload-banner-buttons-container">
                            <input
                                type="file"
                                ref={profileBackgroundInputRef}
                                onChange={handleProfileBackgroundChange}
                                style={{ display: 'none' }}
                            />
                            <button
                                className="btn upload-banner"
                                onClick={triggerProfileBackgroundInput}
                                type="button"
                            >
                                Upload
                            </button>
                            <button
                                className="delete-profile-banner"
                                onClick={handleDeleteProfileBackground}
                                type="button"
                            >
                                <span className="material-symbols-outlined">
                                    delete
                                </span>
                            </button>
                        </div>
                        <p className="upload-banner-text">Upload or Delete Profile Background Picture.</p>
                    </div>
                </div>
            </section>

            <section className="edit-profile-information-section">
                <section className="edit-profile-heading-container">
                    <h2 className="edit-profile-info-header">Profile Settings</h2>
                    <p className="edit-profile-info-subtext">Edit Account Details</p>
                </section>

                <section className="edit-profile-username-panel">
                    <div className="username-label">
                        <label htmlFor="username">Update Username</label>
                    </div>
                    <div className="username-input-form-container">
                        <input
                            type="text"
                            value={editedData.username}
                            onChange={(e) => setEditedData({ ...editedData, username: e.target.value })}
                        />
                        <p className="username-detail-text">Current Username: {userData.username}</p>
                    </div>
                </section>

                <section className="edit-profile-bio-panel">
                    <div className="bio-label">
                        <label htmlFor="bio">Update Bio</label>
                    </div>
                    <div className="bio-input-form-container">
                        <textarea
                            id="bio"
                            placeholder="Enter a Bio up to 300 Characters"
                            value={editedData.bio}
                            onChange={(e) => setEditedData({ ...editedData, bio: e.target.value })}
                        />
                        <p className="bio-detail-text">Current Bio: {userData.bio} </p>
                    </div>
                </section>

                <section className="edit-email-address-panel">
                    <div className="email-label">
                        <label htmlFor="email-address">Update Email Address</label>
                    </div>
                    <div className="email-input-form-container">
                        <input
                            type="email"
                            id="email-address"
                            placeholder="email user has signed up with"
                            value={editedData.email}
                            onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                        />
                        <p className="email-detail-text">Current Registered Email Address: {userData.email}</p>
                    </div>
                </section>

                <section className="save-changes-panel">
                    <button className="btn save-changes">Save Changes</button>
                </section>
            </section>
            <section className="profile-buttons">
                <button
                    className="btn delete-profile"
                    onClick={handleDeleteAccount}
                    type="button"
                >
                    Delete Account
                </button>
            </section>
        </form>
    )
}
