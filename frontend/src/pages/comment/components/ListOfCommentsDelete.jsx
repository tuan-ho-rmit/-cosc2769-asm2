import React from "react";
import { CommentWithReactions } from "./CommentWithReactions";
import { Link } from "react-router-dom"; 

export default function ListOfComments({ comments, onDeleteComment, currentUserId }) {
    if (!comments) {
        return <div>No comments available.</div>;
    }

    return (
        <div className="listOfComments">
            {comments.length > 0 ? (
                comments.map((comment) => (
                    <div key={comment._id} className="createCommentContainer">
                        <div className="commentHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

                            {/* move delete button to the right site */}
                            <div className="deleteButton" style={{ marginLeft: 'auto' }}>
                                <button
                                    onClick={() => onDeleteComment(comment.postId, comment._id)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        backgroundColor: '#FF0000',
                                        color: '#FFFFFF',
                                        borderRadius: '0.25rem',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div className="commentContent">
                            {comment.content}
                        </div>
                        <div className="likeAndComment">
                            <CommentWithReactions commentId={comment._id} onReactionUpdate={() => {}} />
                        </div>

                        {/* see edited comment(only for person who wrote that comment) */}
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
