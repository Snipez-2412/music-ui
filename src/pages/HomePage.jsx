import React from "react";
import AlbumList from "./AlbumList";
import HistoryList from "./HistoryList";

function HomePage() {
  return (
    <div>
      <h2>Albums</h2>
      <AlbumList />

      <h2>Recently Played</h2>
      <HistoryList />
    </div>
  );
}

export default HomePage;
