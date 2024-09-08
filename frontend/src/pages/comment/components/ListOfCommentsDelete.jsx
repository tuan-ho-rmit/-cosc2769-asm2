import React from "react";
import { CommentWithReactions } from "./CommentWithReactions";
import { Link } from "react-router-dom"; // Link import 추가

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

                            {/* 모든 사용자가 삭제할 수 있는 Delete 버튼을 오른쪽에 배치 */}
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
