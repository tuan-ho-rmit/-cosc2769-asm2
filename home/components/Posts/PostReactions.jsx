import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PostReactions = ({ postId }) => {
    const [reactions, setReactions] = useState([]);

    useEffect(() => {
        const fetchReactions = async () => {
            const res = await axios.get(`/api/posts/${postId}/reactions`);
            setReactions(res.data);
        };
        fetchReactions();
    }, [postId]);

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

export default PostReactions;
