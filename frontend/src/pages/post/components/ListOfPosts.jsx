import React, { useState, useEffect } from "react";
import DropDowns from "./DropDowns";
import { Link } from 'react-router-dom';
import CreateComment from "../../comment/components/CreateComment";
import ListOfComments from "../../comment/components/ListOfComments";
import { PostWithReactions } from "./PostWithReactions";

export default function ListOfPosts({ posts, onPostEdit, onPostDelete, user }) {
    const currentUserId = user ? user.id : null; 
    const [commentsByPost, setCommentsByPost] = useState({});
    const [editingPostId, setEditingPostId] = useState(null); // 현재 편집 중인 게시글 ID
    const [updatedContent, setUpdatedContent] = useState(""); // 업데이트할 내용
    const [updatedImages, setUpdatedImages] = useState([]); // 업데이트할 이미지
    const [localPosts, setLocalPosts] = useState(posts); // 로컬 상태로 게시글 관리

    useEffect(() => {
        setLocalPosts(posts);
    }, [posts]);

    // 댓글 가져오기 함수
    const fetchComments = async (postId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/posts/${postId}/comments`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();
            setCommentsByPost(prev => ({ ...prev, [postId]: data }));
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    useEffect(() => {
        localPosts.forEach(post => {
            fetchComments(post._id);
        });
    }, [localPosts]);

    const handleAddComment = (postId, newCommentText) => {
        const newComment = { content: newCommentText, id: Date.now(), author: user };
        setCommentsByPost(prevComments => ({
            ...prevComments,
            [postId]: [...(prevComments[postId] || []), newComment]
        }));

        fetch(`http://localhost:3000/api/posts/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(newComment)
        })
        .then(response => response.json())
        .then(data => {
            fetchComments(postId);
        })
        .catch(error => console.error('Error adding comment:', error));
    };

    const handleEditComment = (postId, commentId, newContent) => {
        console.log(`Editing comment with ID: ${commentId} for post ID: ${postId}`); // 콘솔 로그 추가

        fetch(`http://localhost:3000/api/posts/${postId}/comments/${commentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ content: newContent })
        })
        .then(response => response.json())
        .then(data => {
            console.log(`Comment updated successfully: ${data}`); // 콘솔 로그 추가
            fetchComments(postId);
        })
        .catch(error => console.error('Error editing comment:', error));
    };

    const handleDeleteComment = (postId, commentId) => {
        console.log(`Deleting comment with postId: ${postId} and commentId: ${commentId}`); // 로그 수정

        fetch(`http://localhost:3000/api/posts/${postId}/comments/${commentId}`, {
            method: 'DELETE',
            credentials: 'include',
        })
        .then(() => {
            fetchComments(postId); // 댓글 목록 업데이트
        })
        .catch(error => console.error('Error deleting comment:', error));
    };
    const handleEditPost = (postId) => {
        setEditingPostId(postId);
        const postToEdit = localPosts.find(post => post._id === postId);
        setUpdatedContent(postToEdit.content);
        setUpdatedImages(postToEdit.images);
    };

    const handleSaveEditPost = (postId) => {
        fetch(`http://localhost:3000/api/posts/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ content: updatedContent, images: updatedImages })
        })
        .then(response => response.json())
        .then(() => {
            // 서버에서 업데이트된 포스트를 다시 불러와 populate된 필드를 유지
            fetch(`http://localhost:3000/api/posts/${postId}`, {
                method: 'GET',
                credentials: 'include',
            })
            .then(response => response.json())
            .then(updatedPost => {
                setEditingPostId(null); // 편집 모드 종료
                setLocalPosts(prevPosts => 
                    prevPosts.map(post => post._id === postId ? updatedPost : post)
                ); // 로컬 상태 업데이트
            });
        })
        .catch(error => console.error('Error updating post:', error));
    };

    const handleImageChange = (event) => {
        const files = event.target.files;
        const fileReaders = [];
        const images = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = (e) => {
                images.push(e.target.result);
                if (images.length === files.length) {
                    setUpdatedImages(images);
                }
            };

            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (imageIndex) => {
        setUpdatedImages(updatedImages.filter((_, idx) => idx !== imageIndex));
    };

    const postItems = localPosts.map((each) => {
        const displayImages = each.images.slice(0, 3);
        const remainingImagesCount = each.images.length - 3;
        const isAuthor = currentUserId === each.author._id;

        return (
            <div key={each._id} className="postContainer">
                <div className="postHeader">
                    <div className="imgContainer">
                        <Link to={`/user/${each.author._id}`}>
                            <div className='mx-4'>
                                <img
                                    src={each.userProfile.avatar || 'default-avatar-url.jpg'}
                                    className='w-10 h-10 ring-yellow ring-2 rounded-full'
                                    alt='rounded-avatar'
                                />
                            </div>
                        </Link>
                    </div>
                    <div className="postInfo">
                        <Link to={`/user/${each.author._id}`}>
                            <div className="userName">
                                <p>{each.author.firstName} {each.author.lastName || "Anonymous"}</p>
                            </div>
                        </Link>
                        <div className="postDate">
                            <p>{new Date(each.date).toLocaleString()}</p>
                        </div>
                    </div>
                    {isAuthor && (
                        <div className="dropDown">
                            <DropDowns
                                onEdit={() => handleEditPost(each._id)}
                                onDelete={() => onPostDelete(each._id)}
                            />
                        </div>
                    )}
                </div>
                
                {/* 게시글 편집 모드 */}
                {editingPostId === each._id ? (
                    <div>
                        <input 
                            type="text" 
                            value={updatedContent} 
                            onChange={(e) => setUpdatedContent(e.target.value)} 
                        />
                        <div>
                            {updatedImages.map((image, idx) => (
                                <div key={idx} className="imageWrapper">
                                    <img src={image} alt={`Post image ${idx}`} className="postImage" />
                                    <button onClick={() => handleRemoveImage(idx)}>Remove</button>
                                </div>
                            ))}
                        </div>
                        <input type="file" onChange={handleImageChange} multiple />
                        <button onClick={() => handleSaveEditPost(each._id)}>Save</button>
                    </div>
                ) : (
                    <Link to={`/post/${each._id}`}>
                        <div className="postContent">
                            {each.content}
                        </div>
                        <div className="postContentImg">
                            {displayImages.map((image, idx) => (
                                <div key={idx} className="imageWrapper">
                                    <img src={image} alt={`Post image ${idx}`} className="postImage" />
                                    {idx === 2 && remainingImagesCount > 0 && (
                                        <div className="imageOverlay">
                                            +{remainingImagesCount} Pictures
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Link>
                )}

                <hr className="solidPost"></hr>
                <div className="likeAndComment">
                    <span className="likeBtn">
                    <PostWithReactions postId={each._id} />
                    </span>
                    <span className="commentBtn">
                        <button>Comment</button>
                    </span>
                </div>
                <hr className="solidPost"></hr>
                <div className="commentsSection">
                    <ListOfComments 
                        postId={each._id} 
                        comments={commentsByPost[each._id] || []} 
                        onEditComment={handleEditComment} 
                        onDeleteComment={handleDeleteComment} 
                        currentUserId={currentUserId}
                    />
                    <CreateComment onAddComment={(text) => handleAddComment(each._id, text)} user={user} />
                </div>
            </div>
        );
    });

    return (
        <div className="postListContainer">
            {postItems}
        </div>
    );
}
