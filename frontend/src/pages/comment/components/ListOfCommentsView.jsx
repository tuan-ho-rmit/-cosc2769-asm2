import React from "react";
import { Link } from "react-router-dom"; // Link import 추가

export default function ListOfComments({ comments, reactionCounts = {} }) {
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
                        </div>
                        <div className="commentContent">
                            {comment.content}
                        </div>

                        {/* 감정표현 보여주기 */}
                        <div className="reactionCounts">
                            {reactionCounts[comment._id] && 
                                Object.entries(reactionCounts[comment._id]).map(([reactionType, count]) => (
                                    <div key={reactionType} className="reactionCount" style={{ color: 'black' }}>
                                        {reactionType}: {count}
                                    </div>
                                ))
                            }
                        </div>

                        {/* 댓글 이력 보기 버튼 */}
                        {comment.history && comment.history.length > 0 && (
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
