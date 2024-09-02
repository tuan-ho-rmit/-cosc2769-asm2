import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function CommentHistory() {
  const { commentId } = useParams(); // `commentId`만 가져옴
  const [commentHistories, setCommentHistories] = useState([]);

  useEffect(() => {
    const fetchCommentHistory = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/posts/comments/${commentId}/history`, { // 경로 수정
          method: 'GET',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Error fetching comment history');
        }

        const data = await response.json();
        setCommentHistories(data);
      } catch (error) {
        console.error('Error fetching comment history:', error);
      }
    };

    fetchCommentHistory();
  }, [commentId]);

  return (
    <div className="commentHistoryContainer">
      <h2>Comment History</h2>
      {commentHistories.length > 0 ? (
        commentHistories.map((history, index) => (
          <div key={index} className="historyItem">
            <p>Modified By: {history.modifiedBy.firstName} {history.modifiedBy.lastName}</p>
            <p>Date: {new Date(history.modifiedAt).toLocaleString()}</p>
            <div className="commentContent">
              <p>{history.previousContent}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No modification history available.</p>
      )}
    </div>
  );
}
