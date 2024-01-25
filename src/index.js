import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Login from './components/Login/Login.jsx';
import Homepage from './components/Homepage/Homepage.js';
import CurrentEventsPage from './components/CurrentEventsPage/CurrentEventsPage.jsx';
import GameListPage from './components/GameListPage/GameListPage';
import ProfilePage from './components/ProfilePage/ProfilePage';
import JoinEventPage from './components/JoinEventPage/JoinEventPage';
import CreateEventsPage from './components/CreateEventsPage/CreateEventsPage.js'
import CreateTournamentsPage from './components/CreateTournamentsPage/CreateTournament.js';
import { UserContextTest } from './components/Login/CurrentUserContext.jsx';

const App = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  const [currentUser, setCurrentUser] = useState(null);

  // this use effect gets the currentUser from localStorage
  useEffect(() => {
    const localUser = window.localStorage.getItem('current_user');
    setCurrentUser(localUser);
  }, [])

  // this use effect sets the currentUser to localStorage
  useEffect(() => {
    window.localStorage.setItem('current_user', currentUser);
  }, [currentUser])


  const router = createBrowserRouter(
    [
      { path: '/', element: <Homepage /> },

      { path: '/login', element: isLoggedIn ? <Homepage /> : <Login /> },
      { path: '/user/:username', element: <ProfilePage /> },

      { path: '/game-list', element: <GameListPage /> },

      { path: '/join-event/:tournamentID', element: <JoinEventPage /> },
      { path: '/create-events', element: <CreateEventsPage /> },
      { path: '/create-tournaments', element: <CreateTournamentsPage /> },
      { path: '/events/:gameName', element: <CurrentEventsPage /> },
    ]
  );

  return (
    <UserContextTest.Provider value={{ currentUser, setCurrentUser }}>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </UserContextTest.Provider>
  )
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
