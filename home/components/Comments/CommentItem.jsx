import React from 'react';
import ReactToComment from '../Reaction/ReactToComment';
import CommentReactionList from '../Reaction/CommentReactionList';

function CommentItem({ comment, userId }) {
  return (
    <div>
      <p>{comment.content}</p>
      <CommentReactionList commentId={comment.id} />
      <ReactToComment commentId={comment.id} userId={userId} />
    </div>
  );
}

export default CommentItem;
