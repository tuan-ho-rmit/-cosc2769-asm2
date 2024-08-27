import React, { useState, useEffect } from 'react';
import 'animate.css';

export function CommentWithReactions({ commentId }) {
  const [showCommentReactionBar, setShowCommentReactionBar] = useState(false);
  const [selectedCommentReaction, setSelectedCommentReaction] = useState(null);
  const [hoveredReaction, setHoveredReaction] = useState(null);

  const reactions = [
    { type: 'Like', emoji: '👍' },
    { type: 'Love', emoji: '❤️' },
    { type: 'HaHa', emoji: '😂' },
    { type: 'Angry', emoji: '😡' },
  ];

  const currentUserId = JSON.parse(localStorage.getItem('user')).id;

  useEffect(() => {
    // commentId가 있는 경우에만 fetch 요청을 보냅니다.
    if (commentId) {
      const fetchUserReaction = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/comments/${commentId}/reactions/user`, {
            method: 'GET',
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error('Error fetching user reaction for comment');
          }

          const data = await response.json();
          console.log('Fetched user reaction:', data);

          if (data.reaction) {
            setSelectedCommentReaction(data.reaction);
          } else {
            setSelectedCommentReaction(null);
          }
        } catch (error) {
          console.error('Error fetching user reaction:', error);
        }
      };

      fetchUserReaction();
    }
  }, [commentId, currentUserId]);

  const handleCommentLikeClick = () => {
    setShowCommentReactionBar(!showCommentReactionBar);
  };

  const handleCommentReaction = async (reaction) => {
    try {
      setSelectedCommentReaction(reaction);
      setShowCommentReactionBar(false);

      const response = await fetch(`http://localhost:3000/api/comments/${commentId}/reactions`, {
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

      console.log('Reaction added');
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const handleRemoveCommentReaction = async () => {
    try {
      setSelectedCommentReaction(null);

      const response = await fetch(`http://localhost:3000/api/comments/${commentId}/reactions`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error removing reaction');
      }

      console.log('Reaction removed');
    } catch (error) {
      console.error('Error removing reaction:', error);
    }
  };

  return (
    <div className="reactionContainer">
      <span className="likeBtn" onClick={selectedCommentReaction ? handleRemoveCommentReaction : handleCommentLikeClick}>
        {selectedCommentReaction ? (
          <span className={`selectedReaction animate__animated animate__bounceIn`}>
            {reactions.find(r => r.type === selectedCommentReaction).emoji}
          </span>
        ) : (
          <svg className="h-8 w-8 text-red-500 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        )}
      </span>

      {showCommentReactionBar && (
        <div className="reactionBar">
          {reactions.map((reaction) => (
            <button
              key={reaction.type}
              onClick={() => handleCommentReaction(reaction.type)}
              onMouseEnter={() => setHoveredReaction(reaction.type)}
              onMouseLeave={() => setHoveredReaction(null)}
              className={`reactionButton ${
                selectedCommentReaction === reaction.type ? 'selected' : ''
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
