import React from 'react';
import { useNavigate } from 'react-router-dom';

const Groupnav = () => {
  const navigate = useNavigate();

  return (
    <header style={{ backgroundColor: '#333', padding: '5px', maxWidth: '100%' }}>
      <nav
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <button
          style={{
            backgroundColor: '#444',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            cursor: 'pointer',
            fontSize: '14px',
            borderRadius: '5px', // 모서리를 둥글게
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#555')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#444')}
          onClick={() => navigate('/groups')}
        >
          My Groups
        </button>
        <button
          style={{
            backgroundColor: '#444',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            cursor: 'pointer',
            fontSize: '14px',
            borderRadius: '5px', // 모서리를 둥글게
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#555')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#444')}
          onClick={() => navigate('/discovergroup')}
        >
          Discover Groups
        </button>
        <button
          style={{
            backgroundColor: '#444',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            cursor: 'pointer',
            fontSize: '14px',
            borderRadius: '5px', // 모서리를 둥글게
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#555')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#444')}
          onClick={() => navigate('/creategroup')}
        >
          Create New Group
        </button>
        <button
          style={{
            backgroundColor: '#444',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            cursor: 'pointer',
            fontSize: '14px',
            borderRadius: '5px', // 모서리를 둥글게
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#555')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#444')}
          onClick={() => navigate('/managegroup')}
        >
          Manage Group
        </button>
      </nav>
    </header>
  );
};

export default Groupnav;
