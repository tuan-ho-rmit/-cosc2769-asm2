import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CommentList = ({ postId }) => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchComments = async () => {
            const res = await axios.get(`/api/posts/${postId}/comments`);
            setComments(res.data);
        };
        fetchComments();
    }, [postId]);

    return (
        <div>
            {comments.map((comment) => (
                <div key={comment._id}>
                    <p>{comment.text}</p>
                    <small>By {comment.user.name}</small>
                </div>
            ))}
        </div>
    );
};

export default CommentList;
