import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ViewMembers = () => {
  const { groupId } = useParams();  // URL에서 groupId를 가져오기
  const [members, setMembers] = useState([]);  // 멤버 정보 저장
  const [loading, setLoading] = useState(true);  // 로딩 상태 관리
  const navigate = useNavigate();  // 유저 프로필 페이지로 이동하기 위해 사용

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/groups/members/${groupId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch group members');
        }
        const data = await response.json();
        
        // 받은 데이터가 제대로 들어왔는지 확인을 위한 로그 추가
        console.log('Fetched members:', data);

        setMembers(data);  // 멤버 데이터 저장
        setLoading(false);  // 로딩 완료
      } catch (error) {
        console.error('Error fetching members:', error);
        setLoading(false);  // 에러 발생 시 로딩 완료 상태로 변경
      }
    };

    fetchMembers();
  }, [groupId]);

  const handleProfileClick = (userId) => {
    navigate(`/user/${userId}`);  // 유저 프로필 페이지로 이동
  };

  if (loading) {
    return <div>Loading...</div>;  // 로딩 중일 때 표시
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#EEEEEE', marginBottom: '1rem' }}>Group Members</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {members.map((member) => (
          <div key={member._id} style={{ backgroundColor: '#393E46', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <img 
                src={member.avatar}  // 백엔드에서 받은 아바타 URL 표시
                alt={`${member.firstName} ${member.lastName}`}
                style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '1rem', cursor: 'pointer' }}  // 프로필 사진 클릭 가능
                onClick={() => handleProfileClick(member._id)}  // 프로필 사진 클릭 시 페이지 이동
              />
              <h3 style={{ color: '#FFD369', margin: 0 }}>{member.firstName} {member.lastName}</h3>  {/* 이름 표시 */}
            </div>
            <p style={{ color: '#EEEEEE', marginBottom: '0.5rem' }}>{member.email}</p>  {/* 이메일 표시 */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewMembers;
