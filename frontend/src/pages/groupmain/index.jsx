import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const GroupMain = () => {
    const { groupId } = useParams();  // URL에서 그룹 오브젝트 아이디를 가져옵니다
    const [groupName, setGroupName] = useState('');

    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/groups/${groupId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch group data');
                }
                const result = await response.json();
                setGroupName(result.groupName);  // 그룹의 이름을 상태로 설정합니다
            } catch (error) {
                console.error('Error fetching group data:', error);
            }
        };

        fetchGroupData();
    }, [groupId]);

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ color: '#FFD369' }}>{groupName}</h1>
            {/* 그룹의 다른 정보나 기능을 추가할 수 있습니다 */}
        </div>
    );
};

export default GroupMain;
