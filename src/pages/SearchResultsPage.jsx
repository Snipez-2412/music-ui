import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSearchStore } from "../zustand/store/SearchStore";
import "./SearchResultsPage.css"

function SearchResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { results, loading, search } = useSearchStore();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");

  useEffect(() => {
    if (query) {
      search(query);
    }
  }, [query]);

  const handleClick = (item) => {
    if (item.type === "album") {
      navigate(`/album/${item.title}`);
    } else if (item.type === "song") {
      navigate(`/song/${item.id}`);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Search Results for "{query}"</h2>
      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="results-list">
          {results.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="result-item"
              onClick={() => handleClick(item)}
            >
              <img src={item.signedCoverUrl} alt="img" />
              <div>
                <h4 style={{ margin: 0 }}>{item.title}</h4>
                <small style={{ color: "#888" }}>{item.type}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResultsPage;
