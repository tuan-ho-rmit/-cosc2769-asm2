import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PostHistory() {
  const { id: postId } = useParams(); // 'id'로 가져오는 것이 맞습니다.

  const [postHistories, setPostHistories] = useState([]);

  useEffect(() => {
    const fetchPostHistory = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/posts/${postId}/history`, {
          method: 'GET',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Error fetching post history');
        }

        const data = await response.json();
        console.log('Fetched post history:', data); // 디버깅을 위한 로그 추가
        setPostHistories(data);
      } catch (error) {
        console.error('Error fetching post history:', error);
      }
    };

    fetchPostHistory();
  }, [postId]);

  return (
    <div className="postHistoryContainer">
      <h2>Post History</h2>
      {postHistories.length > 0 ? (
        postHistories.map((history, index) => (
          <div key={index} className="historyItem">
            <p>Modified By: {history.modifiedBy.firstName} {history.modifiedBy.lastName}</p> {/* 수정 */}
            <p>Date: {new Date(history.modifiedAt).toLocaleString()}</p>
            <div className="postContent">
              <p>{history.previousContent}</p>
              {history.previousImages.map((image, idx) => (
                <img key={idx} src={image} alt={`History image ${idx}`} className="postImage" />
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No modification history available.</p>
      )}
    </div>
  );
}
