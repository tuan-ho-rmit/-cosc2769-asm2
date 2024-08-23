import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ReactionList({ postId }) {
  const [reactions, setReactions] = useState([]);

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const response = await axios.get(`/api/reactions/${postId}`);
        setReactions(response.data);
      } catch (error) {
        console.error('Failed to fetch reactions', error);
      }
    };

    fetchReactions();
  }, [postId]);

  const reactionCounts = reactions.reduce(
    (acc, reaction) => {
      acc[reaction.type] = (acc[reaction.type] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <div>
      <span>👍 {reactionCounts.Like || 0}</span>
      <span>❤️ {reactionCounts.Love || 0}</span>
      <span>😆 {reactionCounts.Haha || 0}</span>
      <span>😠 {reactionCounts.Angry || 0}</span>
    </div>
  );
}

export default ReactionList;