import React, { useState, useEffect } from 'react';
import 'animate.css';

export function PostWithReactions({ postId }) {
  const [showPostReactionBar, setShowPostReactionBar] = useState(false);
  const [selectedPostReaction, setSelectedPostReaction] = useState(null);
  const [hoveredReaction, setHoveredReaction] = useState(null);

  const reactions = [
    { type: 'Like', emoji: '👍' },
    { type: 'Love', emoji: '❤️' },
    { type: 'HaHa', emoji: '😂' },
    { type: 'Angry', emoji: '😡' },
  ];

  // 현재 사용자 ID 가져오기 (예: 세션 또는 로컬 저장소에서 가져오기)
  const currentUserId = JSON.parse(localStorage.getItem('user')).id;

  // 초기 로드시 서버에서 리액션 데이터를 가져옵니다.
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Error fetching post reactions');
        }

        const post = await response.json();
        
        // 현재 사용자가 이미 리액션을 추가했는지 확인합니다.
        const userReaction = post.reactions.find(
          (reaction) => reaction.userId._id === currentUserId // 현재 사용자 ID와 비교
        );

        if (userReaction) {
          setSelectedPostReaction(userReaction.type); // 사용자의 리액션 타입 설정
        }
      } catch (error) {
        console.error('Error fetching reactions:', error);
      }
    };

    fetchReactions();
  }, [postId, currentUserId]);

  const handlePostLikeClick = () => {
    setShowPostReactionBar(!showPostReactionBar);
  };

  const handlePostReaction = async (reaction) => {
    try {
      setSelectedPostReaction(reaction);
      setShowPostReactionBar(false);

      const response = await fetch(`http://localhost:3000/api/posts/${postId}/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ reaction }),
      });

      if (!response.ok) {
        throw new Error('Error adding reaction');
      }

      const data = await response.json();
      console.log('Reaction added:', data);
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  return (
    <div className="reactionContainer">
      {/* Like Icon or Selected Reaction for Post */}
      <span className="likeBtn" onClick={handlePostLikeClick}>
        {selectedPostReaction ? (
          <span
            className={`selectedReaction animate__animated animate__bounceIn`}
          >
            {reactions.find(r => r.type === selectedPostReaction).emoji}
          </span>
        ) : (
          <svg className="h-8 w-8 text-red-500 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        )}
      </span>

      {/* Reaction Bar for Post */}
      {showPostReactionBar && (
        <div className="reactionBar">
          {reactions.map((reaction) => (
            <button
              key={reaction.type}
              onClick={() => handlePostReaction(reaction.type)}
              onMouseEnter={() => setHoveredReaction(reaction.type)}
              onMouseLeave={() => setHoveredReaction(null)}
              className={`reactionButton ${
                selectedPostReaction === reaction.type ? 'selected' : ''
              } ${
                hoveredReaction === reaction.type ? 'animate__animated animate__pulse' : ''
              }`}
            >
              {reaction.emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
