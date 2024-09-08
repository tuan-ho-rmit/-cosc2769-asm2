import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ViewMembers = () => {
  const { groupId } = useParams();  // get group id from url
  const [members, setMembers] = useState([]);  // save member data as array
  const [loading, setLoading] = useState(true);  // manage loading
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/groups/members/${groupId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch group members');
        }
        const data = await response.json();
        
        // log to check data is retreived well for debuging purpose
        console.log('Fetched members:', data);

        setMembers(data);  // save user data
        setLoading(false);  // finish loading
      } catch (error) {
        console.error('Error fetching members:', error);
        setLoading(false);  // when have error
      }
    };

    fetchMembers();
  }, [groupId]);

  const handleProfileClick = (userId) => {
    navigate(`/user/${userId}`);  // navigate to user profile page
  };

  if (loading) {
    return <div>Loading...</div>;  // display when loading
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#EEEEEE', marginBottom: '1rem' }}>Group Members</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {members.map((member) => (
          <div key={member._id} style={{ backgroundColor: '#393E46', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <img 
                src={member.avatar}  // display user avatar from backend(group controller)
                alt={`${member.firstName} ${member.lastName}`}
                style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '1rem', cursor: 'pointer' }}  // clcikable profie(move to user profile page)
                onClick={() => handleProfileClick(member._id)}  // 프로필 사진 클릭 시 페이지 이동
              />
              <h3 style={{ color: '#FFD369', margin: 0 }}>{member.firstName} {member.lastName}</h3>  {/* dispkay name */}
            </div>
            <p style={{ color: '#EEEEEE', marginBottom: '0.5rem' }}>{member.email}</p>  {/* display email */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewMembers;
