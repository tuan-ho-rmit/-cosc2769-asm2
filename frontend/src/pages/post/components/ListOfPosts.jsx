import React, { useState, useEffect } from "react";
import DropDowns from "./DropDowns";
import { Link } from 'react-router-dom';
import CreateComment from "../../comment/components/CreateComment";
import ListOfComments from "../../comment/components/ListOfComments";
import { PostWithReactions } from "./PostWithReactions";

export default function ListOfPosts({ posts, onPostEdit, onPostDelete, user }) {
    const currentUserId = user ? user.id : null; 
    const [commentsByPost, setCommentsByPost] = useState({});
    const [editingPostId, setEditingPostId] = useState(null);
    const [updatedContent, setUpdatedContent] = useState("");
    const [updatedImages, setUpdatedImages] = useState([]);
    const [localPosts, setLocalPosts] = useState(posts); // 로컬 상태로 게시글 관리
    const [reactionCounts, setReactionCounts] = useState({}); // 모든 게시글의 리액션 개수 상태

    useEffect(() => {
        setLocalPosts(posts);
    }, [posts]);

    useEffect(() => {
        localPosts.forEach(post => {
            fetchComments(post._id);
            fetchReactionCounts(post._id); // 각 게시글에 대한 리액션 개수 가져오기
        });
    }, [localPosts]);

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

    const fetchReactionCounts = async (postId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/posts/${postId}/reactions/count`, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            setReactionCounts(prev => ({ ...prev, [postId]: data }));
        } catch (error) {
            console.error('Error fetching reaction counts:', error);
        }
    };

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
        .then(() => {
            fetchComments(postId);
        })
        .catch(error => console.error('Error adding comment:', error));
    };

    const handleEditComment = (postId, commentId, newContent) => {
        fetch(`http://localhost:3000/api/posts/${postId}/comments/${commentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ content: newContent })
        })
        .then(response => response.json())
        .then(() => {
            fetchComments(postId);
        })
        .catch(error => console.error('Error editing comment:', error));
    };

    const handleDeleteComment = (postId, commentId) => {
        fetch(`http://localhost:3000/api/posts/${postId}/comments/${commentId}`, {
            method: 'DELETE',
            credentials: 'include',
        })
        .then(() => {
            fetchComments(postId);
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
            fetch(`http://localhost:3000/api/posts/${postId}`, {
                method: 'GET',
                credentials: 'include',
            })
            .then(response => response.json())
            .then(updatedPost => {
                setEditingPostId(null);
                setLocalPosts(prevPosts => 
                    prevPosts.map(post => post._id === postId ? updatedPost : post)
                );
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

    const updateReactionCounts = (postId) => {
        fetchReactionCounts(postId);
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

                <div className="reactionCounts">
                    {Object.entries(reactionCounts[each._id] || {}).map(([type, count]) => (
                        <div key={type} className="reactionCount">
                            {type}: {count}
                        </div>
                    ))}
                </div>

                <hr className="solidPost"></hr>
                <div className="likeAndComment">
                    <span className="likeBtn">
                        <PostWithReactions postId={each._id} onReactionUpdate={() => updateReactionCounts(each._id)} />
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
