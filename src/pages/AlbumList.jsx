import React, { useEffect, useMemo } from "react";
import Card from "../main/card";
import useAlbumStore from "../zustand/store/albumStore";

function AlbumList() {
  const albums = useAlbumStore((state) => state.albums);
  const loading = useAlbumStore((state) => state.loading);
  const error = useAlbumStore((state) => state.error);
  const fetchAllAlbums = useAlbumStore((state) => state.fetchAllAlbums);

  useEffect(() => {
    fetchAllAlbums();
  }, [fetchAllAlbums]);

  const randomAlbums = useMemo(() => {
    if (albums.length > 0) {
      const shuffled = [...albums].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 5);
    }
    return [];
  }, [albums]);

  return (
    <div className="album-list">
      {loading ? (
        <p>Loading albums...</p>
      ) : error ? (
        <p>Error fetching albums: {error}</p>
      ) : randomAlbums.length > 0 ? (
        randomAlbums.map((album) => (
          <Card
            key={album.albumID}
            image={album.signedCoverUrl}
            title={album.title}
            info={album.artistName || "Unknown Artist"}
            type="album"
          />
        ))
      ) : (
        <p>No albums available.</p>
      )}
    </div>
  );
}

export default AlbumList;
