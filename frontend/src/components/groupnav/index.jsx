import React from 'react';
import { useNavigate } from 'react-router-dom';

const Groupnav = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <button className="sidebarButton">Discover Groups</button>
      <button className="sidebarButton">View All Groups</button>
      <button className="sidebarButton" onClick={() => navigate('/creategroup')}>
        Create New Group
      </button>
      <button className="sidebarButton" onClick={() => navigate('/managegroup')}>
        Manage Group
      </button>
      <div className="sidebarList">
        {/* <h3>Group List</h3> */}
      </div>
    </div>
  );
};

export default Groupnav;
