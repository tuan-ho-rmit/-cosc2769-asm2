import React from "react";
import DropDowns from "../../post/components/DropDowns";
import { CommentWithReactions } from "./CommentWithReactions";

export default function ListOfComments({ comments, onEditComment, onDeleteComment, currentUserId }) {
    if (!comments) {
        return <div>No comments available.</div>;
    }

    return (
        <div className="listOfComments">
            {comments.length > 0 ? (
                comments.map((comment) => (
                    <div key={comment._id} className="createCommentContainer">
                        <div className="commentHeader">
                            <div className="imgContainer">
                                <span className="mx-4">
                                    <img 
                                        src={comment.author && comment.author.avatar ? comment.author.avatar : 'default-avatar-url.jpg'} 
                                        alt="User Avatar"
                                        className='w-10 h-10 ring-yellow ring-2 rounded-full'
                                    />
                                </span>
                            </div>
                            <div className="commentInfo">
                                <div className="commentUserName">
                                    <p>{comment.author && comment.author.firstName} {comment.author && comment.author.lastName}</p>
                                </div>
                                <div className="commentDate">
                                    <p>{new Date(comment.date).toLocaleString()}</p>
                                </div>
                            </div>
                            {currentUserId === comment.author._id && (
                                <div className="dropDown">
                                    <DropDowns
                                        onEdit={() => {
                                            const newContent = prompt("Edit your comment:", comment.content);
                                            if (newContent) {
                                                onEditComment(comment.postId, comment._id, newContent);
                                            }
                                        }}
                                        onDelete={() => onDeleteComment(comment.postId, comment._id)}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="commentContent">
                            {comment.content}
                        </div>
                        <div className="likeComment">
                            {/* ReactionForComment 컴포넌트 추가 */}
                            <CommentWithReactions commentId={comment._id} />
                        </div>
                    </div>
                ))
            ) : (
                <p>No comments yet.</p>
            )}
        </div>
    );
}
