import React, { useState } from "react";

export default function CreateComment({
    onAddComment,
    user, // 로그인된 유저 정보를 받아옴
}) {
    const userAvatar = user?.avatar; // 유저 아바타를 가져옴
    const [commentText, setCommentText] = useState(""); // 댓글 내용을 위한 상태

    // 댓글 추가 핸들러
    const handleAddComment = () => {
        if (commentText.trim()) { // 빈 댓글이 아닌 경우에만 추가
            onAddComment(commentText); // 부모 컴포넌트로 댓글 내용 전달
            setCommentText(""); // 댓글 입력 필드 초기화
        }
    };

    return (
        <div className="createCommentContainer">
            <div className="postHeaderForInputPost">
                <div className="imgContainer">
                    <div className='mx-4'>
                        <img 
                            src={userAvatar || 'default-avatar-url.jpg'}
                            className='w-10 h-10 ring-yellow ring-2 rounded-full' 
                            alt='rounded-avatar'
                        />
                    </div>
                </div>
                <div className="commentInput">
                    <input 
                        value={commentText} 
                        onChange={(e) => setCommentText(e.target.value)} 
                        type="text" 
                        placeholder="Write a comment..."
                    />
                </div>
            </div>
            <hr className="solid"></hr>
            <div className="commentBtnContainer">
                <button 
                    className="commentsubmitBtn" 
                    onClick={handleAddComment} 
                    disabled={!commentText.trim()} // 댓글이 없으면 버튼 비활성화
                >
                    Post Comment
                </button>
            </div>
        </div>
    );
}
