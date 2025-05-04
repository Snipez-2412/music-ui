import React from "react";
import { Link } from "react-router-dom";

function Card({ image, title, info, type }) {
  const linkTarget = type === "album" ? `/album/${title}` : `/playlist/${title}`;

  return (
    <div className="card">
      <Link to={linkTarget} className="card-link">
        <img src={image} className="card-img" alt={title} />
        <p className="card-title">{title}</p>
        <p className="card-info">{info}</p>
      </Link>
    </div>
  );
}

export default Card;
