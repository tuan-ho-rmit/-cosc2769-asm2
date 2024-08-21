import React, { useState } from 'react';
import axios from 'axios';

const PostDetail = ({ post }) => {
    const [comments, setComments] = useState(post.comments);
    const [newComment, setNewComment] = useState('');

    const handleAddComment = async () => {
        try {
            const res = await axios.post('/api/comments/add', { postId: post._id, text: newComment });
            setComments([...comments, res.data]);
            setNewComment('');
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <div>
            <h2>{post.text}</h2>
            <div>
                {comments.map((comment) => (
                    <div key={comment._id}>
                        <p>{comment.text}</p>
                    </div>
                ))}
            </div>
            <div>
                <input 
                    type="text" 
                    value={newComment} 
                    onChange={(e) => setNewComment(e.target.value)} 
                    placeholder="Add a comment..."
                />
                <button onClick={handleAddComment}>Comment</button>
            </div>
        </div>
    );
};

export default PostDetail;
