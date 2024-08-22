import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CommentList = ({ postId }) => {
    const [comments, setComments] = useState([]);

    const fetchComments = async () => {
        try {
            const res = await axios.get(`/api/posts/${postId}/comments`);
            setComments(res.data);
        } catch (err) {
            console.error(err.response.data);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    return (
        <div>
            <h3>Comments</h3>
            <ul>
                {comments.map((comment) => (
                    <li key={comment._id}>
                        <strong>{comment.user.name}:</strong> {comment.text}
                    </li>
                ))}
            </ul>
            <CommentForm postId={postId} fetchComments={fetchComments} />
        </div>
    );
};

export default CommentList;
