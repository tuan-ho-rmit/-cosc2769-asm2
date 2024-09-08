import React, { useState, useEffect, useContext } from 'react';
import 'animate.css';
import { useAuth } from '../../../provider/AuthProvider';

export function PostWithReactions({ postId, onReactionUpdate }) {
  const [showPostReactionBar, setShowPostReactionBar] = useState(false);
  const [selectedPostReaction, setSelectedPostReaction] = useState(null);
  const [hoveredReaction, setHoveredReaction] = useState(null);
  const {user} = useAuth()
  const reactions = [
    { type: 'Like', emoji: '👍' },
    { type: 'Love', emoji: '❤️' },
    { type: 'HaHa', emoji: '😂' },
    { type: 'Angry', emoji: '😡' },
  ];

  const currentUserId = user?.id;

  // Adding Previous State Storage Variables
  const [lastFetchedPostId, setLastFetchedPostId] = useState(null);

  useEffect(() => {
    // Prevent duplicate calls by ensuring that they are the same as the previously called postId
    if (lastFetchedPostId !== postId) {
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

          const userReaction = post.reactions.find(
            (reaction) => reaction.userId.toString() === currentUserId.toString()
          );

          if (userReaction) {
            setSelectedPostReaction(userReaction.type);
          } else {
            setSelectedPostReaction(null);
          }

          // Calling an external callback each time the reaction status is updated
          if (onReactionUpdate) {
            onReactionUpdate();
          }

          // Update Status
          setLastFetchedPostId(postId);
        } catch (error) {
          console.error('Error fetching post reactions:', error);
        }
      };

      fetchReactions();
    }
  }, [postId, currentUserId, onReactionUpdate, lastFetchedPostId]); // lastFetchedPostId 추가

  const handlePostLikeClick = () => {
    setShowPostReactionBar(!showPostReactionBar);
  };

  const handlePostReaction = async (reaction) => {
    if (selectedPostReaction === reaction) {
      try {
        const response = await fetch(`http://localhost:3000/api/posts/${postId}/reactions`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ userId: currentUserId }),
        });

        if (!response.ok) {
          throw new Error('Error removing reaction');
        }

        setSelectedPostReaction(null);
        console.log('Reaction removed');

        // Calling an external callback when a reaction is deleted
        if (onReactionUpdate) {
          onReactionUpdate();
        }
      } catch (error) {
        console.error('Error removing reaction:', error);
      }
    } else {
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

        // Calling an external callback when a reaction is added
        if (onReactionUpdate) {
          onReactionUpdate();
        }
      } catch (error) {
        console.error('Error adding or updating reaction:', error);
      }
    }
  };

  return (
    <div className="reactionContainer">
      {/* Like Icon or Selected Reaction for Post */}
      <span className="likeBtn" onClick={selectedPostReaction ? () => handlePostReaction(selectedPostReaction) : handlePostLikeClick}>
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
