import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MusicPlayer from "./MusicPlayer";
import MainContent from "./MainContent";
import { Outlet } from "react-router-dom";

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

  export default MainPage;