import React from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useUserStore } from "../../zustand/store/UserStore";
import { HomeOutlined } from "@ant-design/icons"; // Import the house icon
import Sidebar from "./AdminSidebar";
import './AdminLayout.css';

function AdminLayout() {
  const currentUser = useUserStore((state) => state.currentUser);
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Redirect non-admin users
  if (!currentUser || !currentUser.roles.includes("ROLE_ADMIN")) {
    return <Navigate to="/" />;
  }

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <button
          className="home-icon-button"
          onClick={() => navigate("/")} // Navigate to the home page
        >
          <HomeOutlined />
        </button>
        <h4>Admin Dashboard</h4>
        <span className="user-info">Welcome, {currentUser.username}!</span>
      </header>
      <div className="admin-body">
        <Sidebar />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;