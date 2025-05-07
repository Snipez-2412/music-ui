// App.jsx
import React, { useEffect } from "react";
import '@ant-design/v5-patch-for-react-19';
import { Route, Routes, useLocation } from "react-router-dom"; // Import useLocation
import "./main/main.css";

import MainPage from "./main/MainPage";
import MusicPlayer from "./main/MusicPlayer";

import HomePage from "./pages/HomePage";
import PlaylistPage from "./Pages/PlaylistPage";
import CreatePlaylist from "./pages/CreatePlaylist";
import UpdatePlaylistPage from "./pages/UpdatePlaylistPage";
import AlbumPage from "./Pages/AlbumPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import LikedPage from "./pages/LikedPage";

import AdminLayout from "./admin/layouts/AdminLayout";
import ManageSongs from "./admin/pages/ManageSongs";
import ManageAlbums from "./admin/pages/ManageAlbums";
import ManageUsers from "./admin/pages/ManageUsers";
import ManageArtists from "./admin/pages/ManageArtists";

import CombinedSignInPage from "./login/Login";
import SignUp from "./login/signup";

import { useUserStore } from "./zustand/store/UserStore";

function App() {
  const restoreUser = useUserStore((state) => state.restoreUserFromSession);
  const location = useLocation(); // Get the current route location

  useEffect(() => {
    restoreUser();
  }, [restoreUser]);

  // Check if the current route is under /admin, /login, or /signup
  const isExcludedRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup");

  return (
    <div className="app">
      {/* Conditionally render MusicPlayer */}
      {!isExcludedRoute && <MusicPlayer />}

      <Routes>
        {/* Main */}
        <Route path="/" element={<MainPage />}>
          <Route index element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="album/:title" element={<AlbumPage />} />
          <Route path="/create-playlist" element={<CreatePlaylist />} />
          <Route path="update-playlist/:id" element={<UpdatePlaylistPage />} />
          <Route path="playlist/:name" element={<PlaylistPage />} />
          <Route path="liked-page" element={<LikedPage />} />
        </Route>
        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="songs" element={<ManageSongs />} />
          <Route path="albums" element={<ManageAlbums />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="artists" element={<ManageArtists />} />
        </Route>
        {/* Auth */}
        <Route path="/login" element={<CombinedSignInPage />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;
