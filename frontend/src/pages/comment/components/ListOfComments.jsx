import React from "react";
import DropDowns from "../../post/components/DropDowns";
import { CommentWithReactions } from "./CommentWithReactions";
import { Link } from "react-router-dom"; // Link import 추가

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
                        <div className="likeAndComment">
                            <CommentWithReactions commentId={comment._id} onReactionUpdate={() => {}} />
                        </div>

                        {/* 댓글 수정 이력 보기 버튼 - 작성자에게만 표시 */}
                        {currentUserId === comment.author._id && comment.history && comment.history.length > 0 && (
                            <div className="modifiedSection">
                                <Link to={`/comment/${comment._id}/history`}>
                                    <button>Show Comment History</button>
                                </Link>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>No comments yet.</p>
            )}
        </div>
    );
}
