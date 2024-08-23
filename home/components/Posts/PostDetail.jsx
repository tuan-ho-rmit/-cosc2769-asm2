import React from 'react';
import ReactToPost from '../Reaction/ReactToPost';
import ReactionList from '../Reaction/ReactionList';
import CommentList from '../Comment/CommentList';
import CreateComment from '../Comment/CreateComment';

function PostDetail({ post, userId }) {
  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      
      <h3>Reactions</h3>
      <ReactionList postId={post.id} />
      <ReactToPost postId={post.id} userId={userId} />
      
      <h3>Comments</h3>
      <CommentList postId={post.id} />
      <CreateComment postId={post.id} userId={userId} />
    </div>
  );
}

export default PostDetail;