import React from "react";
import backIcon from "../assets/back_icon.png";
import nextIcon from "../assets/next_icon.png";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

export function StickyNav() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleNextClick = () => {
    navigate(1);
  };

  return (
    <div className="sticky-nav">
      <div className="sticky-nav-icons">
        <img src={backIcon} alt="back_icon" onClick={handleBackClick} />
        <img src={nextIcon} className="hide" alt="next_icon" onClick={handleNextClick} />
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="main-content">
      <StickyNav />
      <Outlet />
    </div>
  );
}

export default MainContent;
