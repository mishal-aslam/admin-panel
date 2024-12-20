import React from "react";
import { Link } from "react-router-dom";
import {
  BsCart3,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsFillGearFill,
} from "react-icons/bs";

function Sidebar({ openSidebarToggle, OpenSidebar, handleLogout }) {
  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <BsCart3 className="icon_header" /> SHOP
        </div>
        <span className="icon close_icon" onClick={OpenSidebar}>
          X
        </span>
      </div>

      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <Link to="/">
            <BsGrid1X2Fill className="icon" /> Dashboard
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/staff">
            <BsPeopleFill className="icon" /> Staff
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/rooms">
            <BsFillGrid3X3GapFill className="icon" /> Rooms
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/customer">
            <BsMenuButtonWideFill className="icon" /> Customer
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/services">
            <BsMenuButtonWideFill className="icon" /> Services
          </Link>
        </li>
      </ul>

   
        {/* Logout button */}
  {handleLogout && (
    <button
      className="logout-btn"
      onClick={handleLogout}
    >
      Logout
    </button>
  )}
    </aside>
  );
}

export default Sidebar;
