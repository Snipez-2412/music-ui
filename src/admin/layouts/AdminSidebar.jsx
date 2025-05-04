import React from "react";
import { NavLink } from "react-router-dom";
import './AdminSidebar.css';

function AdminSidebar() {
  return (
    <nav className="admin-sidebar">
      <h2>Navigation</h2>
      <ul>
        <li>
          <NavLink to="/admin/songs" activeClassName="active-link">
            Manage Songs
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/albums" activeClassName="active-link">
            Manage Albums
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/users" activeClassName="active-link">
            Manage Users
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/artists" activeClassName="active-link">
            Manage Artists
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default AdminSidebar;