import React, { useState } from 'react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import ReactionButtons from './ReactionButtons';
import PostReactions from './PostReactions';


const PostDetail = ({ post }) => {
    const [currentReaction, setCurrentReaction] = useState(null);

    const handleReactionChange = (newReaction) => {
        setCurrentReaction(newReaction);
    };

    return (
        <div>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <ReactionButtons postId={post._id} onReactionChange={handleReactionChange} />
            <PostReactions postId={post._id} />
            <CommentForm postId={post._id} />
            <CommentList postId={post._id} />
        </div>
    );
};

export default PostDetail;
