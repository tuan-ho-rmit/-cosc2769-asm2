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

        console.log('Fetched post data:', post);

        // 사용자 리액션 체크 및 설정
        const userReaction = post.reactions.find(
          (reaction) => reaction.userId.toString() === currentUserId.toString()
        );

        console.log('Found user reaction:', userReaction);

        // 사용자 리액션이 존재하면 상태 업데이트
        if (userReaction) {
          setSelectedPostReaction(userReaction.type);
        } else {
          setSelectedPostReaction(null);
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
    if (selectedPostReaction === reaction) {
      // 동일한 리액션을 선택한 경우 삭제
      try {
        const response = await fetch(`http://localhost:3000/api/posts/${postId}/reactions`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ userId: currentUserId }), // 사용자 ID를 보내서 리액션 삭제
        });

        if (!response.ok) {
          throw new Error('Error removing reaction');
        }

        setSelectedPostReaction(null);
        console.log('Reaction removed');
      } catch (error) {
        console.error('Error removing reaction:', error);
      }
    } else {
      // 새로운 리액션을 추가하거나 업데이트
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
          throw new Error('Error adding or updating reaction');
        }

        const data = await response.json();
        console.log('Reaction added or updated:', data);
      } catch (error) {
        console.error('Error adding or updating reaction:', error);
      }
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
