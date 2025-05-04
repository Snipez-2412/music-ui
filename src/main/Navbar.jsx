import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../zustand/store/UserStore";

function Navbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const { currentUser, setCurrentUser } = useUserStore((state) => state);

  useEffect(() => {
    console.log("Current User:", currentUser);
  }, [currentUser]);

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  const handleProfileClick = () => {
    if (currentUser) {
      navigate(`/profile/${currentUser.id}`, { state: { user: currentUser } });
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/login");
  };

  const getDisplayName = () => {
    if (!currentUser) return "";
    return currentUser.name || currentUser.username || currentUser.email || "User";
  };

  return (
    <div className="navbar">
      <div className="left">
        <div className="nav-option" id="nav-option-home">
          <Link to="/" className="nav-link">
            <i className="fa-solid fa-house"></i>
          </Link>
        </div>
        <div className="search-bar">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="What do you want to play?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <div className="divider"></div>
          <i className="fa-solid fa-box-archive"></i>
        </div>
      </div>

      <div className="right">
      {currentUser?.roles?.includes("ROLE_ADMIN") && (
          <button
            className="admin-btn"
            onClick={() => navigate("/admin")}
            style={{
              backgroundColor: "#1DB954",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            Admin
          </button>
        )}
        {currentUser ? (
          <div className="profile-section" style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: "10px", fontWeight: "bold", color: "#1DB954" }}>
              👋 {getDisplayName()}
            </span>
            <button
              className="logout-btn"
              onClick={handleLogout}
              style={{
                backgroundColor: "#1DB954",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <i
            className="fa-regular fa-user nav-item"
            onClick={handleProfileClick}
            title="Login"
            style={{ cursor: "pointer", fontSize: "20px" }}
          ></i>
        )}
      </div>
    </div>
  );
}

export default Navbar;
