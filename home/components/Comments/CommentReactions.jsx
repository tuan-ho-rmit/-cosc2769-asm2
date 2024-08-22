import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CommentReactions = ({ commentId }) => {
    const [reactions, setReactions] = useState([]);

    useEffect(() => {
        const fetchReactions = async () => {
            const res = await axios.get(`/api/posts/comments/${commentId}/reactions`);
            setReactions(res.data);
        };
        fetchReactions();
    }, [commentId]);

    return (
        <div>
            {reactions.map((reaction) => (
                <span key={reaction._id}>
                    {reaction.type} by {reaction.user.name} <br/>
                </span>
            ))}
        </div>
    );
};

export default CommentReactions;
