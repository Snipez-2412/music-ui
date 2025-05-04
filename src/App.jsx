// App.jsx
import React, { useEffect } from "react";
import '@ant-design/v5-patch-for-react-19';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import "./main/main.css";

import Navbar from "./main/Navbar";
import Sidebar from "./main/Sidebar";
import MainContent from "./main/MainContent";
import MusicPlayer from "./main/MusicPlayer";

import HomePage from "./pages/HomePage";
import PlaylistPage from "./Pages/PlaylistPage";
import CreatePlaylist from "./pages/CreatePlaylist";
import UpdatePlaylistPage from "./pages/UpdatePlaylistPage";
import AlbumPage from "./Pages/AlbumPage";
import SearchResultsPage from "./pages/SearchResultsPage";

import AdminLayout from "./admin/layouts/AdminLayout";
import ManageSongs from "./admin/pages/ManageSongs";
import ManageAlbums from "./admin/pages/ManageAlbums";
import ManageUsers from "./admin/pages/ManageUsers";
import ManageArtists from "./admin/pages/ManageArtists";

import CombinedSignInPage from "./login/Login";
import SignUp from "./login/signup";

import { useUserStore } from "./zustand/store/UserStore";

function App() {
  const restoreUser = useUserStore((state) => state.restoreUserFromToken);

  return (
    <Router>
      <Routes>
        {/* Main */}
        <Route path="/" element={<MainPage />}>
          <Route index element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="album/:title" element={<AlbumPage />} />
          <Route path="/create-playlist" element={<CreatePlaylist />} />
          <Route path="update-playlist/:id" element={<UpdatePlaylistPage />} />
          <Route path="playlist/:name" element={<PlaylistPage />} />
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
    </Router>
  );
}

function MainPage() {
  return (
    <div className="main">
      <Navbar />
      <Sidebar />
      <MainContent>
        <Outlet />
      </MainContent>
      <MusicPlayer />
    </div>
  );
}

export default App;
