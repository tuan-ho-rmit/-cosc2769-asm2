import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import CreateComment from "../../comment/components/CreateComment";
import ListOfCommentsDelete from "../../comment/components/ListOfCommentsDelete";
import { PostWithReactions } from "./PostWithReactions";
import '../../../components/button/index.css';
// import Button from "../../../../components/button/index.jsx";

export default function ListOfPosts({ posts, onPostDelete, user, setPostList }) {
    const currentUserId = user ? user.id : null;
    const [commentsByPost, setCommentsByPost] = useState({});
    const [editingPostId, setEditingPostId] = useState(null);
    const [updatedContent, setUpdatedContent] = useState("");
    const [updatedImages, setUpdatedImages] = useState([]);
    const [reactionCounts, setReactionCounts] = useState({});
    const fileInputRef = useRef(null); // fileInputRef 정의

    useEffect(() => {
        if (posts.length > 0) {
            const fetchData = async () => {
                await Promise.all(posts.map(async (post) => {
                    await fetchComments(post._id);
                    await fetchReactionCounts(post._id);
                }));
            };

            fetchData();
        }
    }, [posts]);

    const fetchComments = async (postId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/posts/${postId}/comments`, {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Error fetching comments');
            }
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
            if (!response.ok) {
                throw new Error('Error fetching reaction counts');
            }
            const data = await response.json();
            setReactionCounts(prev => ({ ...prev, [postId]: data }));
        } catch (error) {
            console.error('Error fetching reaction counts:', error);
        }
    };

    const handleDeletePost = (postId) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            fetch(`http://localhost:3000/api/posts/${postId}`, {
                method: 'DELETE',
                credentials: 'include',
            })
                .then(() => {
                    setPostList(prevPosts => prevPosts.filter(post => post._id !== postId));
                })
                .catch(error => console.error('Error deleting post:', error));
        }
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
    const handleEditPost = (postId) => {
        setEditingPostId(postId);
        const postToEdit = posts.find(post => post._id === postId);
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
            .then(async () => {
                const updatedPost = await fetch(`http://localhost:3000/api/posts/${postId}`, {
                    method: 'GET',
                    credentials: 'include',
                }).then(response => response.json());

                if (typeof updatedPost.groupId === 'string') {
                    const groupResponse = await fetch(`http://localhost:3000/api/groups/${updatedPost.groupId}`);
                    const groupData = await groupResponse.json();
                    updatedPost.groupId = groupData;
                }

                if (updatedPost.groupId && updatedPost.groupId.groupName) {
                    console.log('Group Name:', updatedPost.groupId.groupName);
                    console.log('Group Avatar:', updatedPost.groupId.avatar);
                }

                setEditingPostId(null);
                setPostList(prevPosts =>
                    prevPosts.map(post => post._id === postId ? updatedPost : post)
                );
            })
            .catch(error => console.error('Error updating post:', error));
    };

    const handleImageChange = (event) => {
        const files = event.target.files;
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

    const postItems = posts.map((each) => {
        const isGroupPost = each.isGroupPost;
        const groupName = isGroupPost && each.groupId && each.groupId.groupName ? each.groupId.groupName : 'Unknown Group';
        const groupAvatar = isGroupPost && each.groupId && each.groupId.avatar ? each.groupId.avatar : 'default-group-avatar-url.jpg';

        const displayImages = each.images.slice(0, 3);
        const remainingImagesCount = each.images.length - 3;
        const isAuthor = currentUserId === each.author._id;

        const commentsToShow = (commentsByPost[each._id] || []).slice(0, 3);
        const hasMoreComments = (commentsByPost[each._id] || []).length > 3;

        return (
            <div key={each._id} className="postContainer">
                {isGroupPost && (
                    <div className="groupInfo">
                        <div className="groupAvatar">
                            <img src={groupAvatar} alt="Group Avatar" className="w-8 h-8 rounded-full" />
                        </div>
                        <div className="groupName">
                            <p>{groupName}</p>
                        </div>
                    </div>
                )}
                <div className="postHeader">
                    <div className="imgContainer">
                        <Link to={currentUserId === each.author._id ? '/mydetail' : `/user/${each.author._id}`}>
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
                        <Link to={currentUserId === each.author._id ? '/mydetail' : `/user/${each.author._id}`}>
                            <div className="userName">
                                <p>{each.author.firstName} {each.author.lastName || "Anonymous"}</p>
                            </div>
                        </Link>
                        <div className="postDate">
                            <p>{new Date(each.date).toLocaleString()}</p>
                        </div>
                        {each.private && (
                            <div className="privacyBadge">
                                <p>Friends Only</p>
                            </div>
                        )}
                    </div>

                    {/* 기존 드롭다운 대신 누구나 삭제할 수 있는 Delete 버튼 추가 */}
                    <div className="deleteButton" style={{ marginLeft: 'auto' }}>
                        <button
                            onClick={() => handleDeletePost(each._id)}
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

                {editingPostId === each._id ? (
                    <div>
                        <input
                            type="text"
                            value={updatedContent}
                            onChange={(e) => setUpdatedContent(e.target.value)}
                            className="editInput"
                        />
                        <div>
                            {updatedImages.map((image, idx) => (
                                <div key={idx} className="imageWrapper">
                                    <img src={image} alt={`Post image ${idx}`} className="postImage" />
                                    <button type="button" onClick={() => handleRemoveImage(idx)}
                                        class="ripple-button flex items-center justify-center rounded-full relative overflow-hidden font-normal transition bg-danger text-white hover:bg-darkDanger py-2 px-4 text-md  active:opacity-[0.85]">Remove</button>
                                </div>
                            ))}
                        </div>
                        <div className="editBtnContainer">
                            <button className="fileSelectButton" onClick={() => fileInputRef.current.click()}>
                                Select File
                            </button>
                            <input
                                type="file"
                                onChange={handleImageChange}
                                multiple
                                className="imageUploadInput"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                            />

                            <button onClick={() => handleSaveEditPost(each._id)} className="saveButton">
                                Save
                            </button>
                        </div>
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
                        <div key={type} className="reactionCount" style={{ color: 'black' }}>
                            {type}: {count}
                        </div>
                    ))}
                </div>

                {isAuthor && each.history && each.history.length > 0 && (
                    <div className="modifiedSection">
                        <Link to={`/post/${each._id}/history`}>
                            <button>Show Modified History</button>
                        </Link>
                    </div>
                )}

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
                    <ListOfCommentsDelete
                        postId={each._id}
                        comments={commentsToShow}
                        onEditComment={handleEditComment}
                        onDeleteComment={handleDeleteComment}
                        currentUserId={currentUserId}
                    />
                    {hasMoreComments && (
                        <Link to={`/post/${each._id}`}>
                            <button className="seeMoreComments">See more comments</button>
                        </Link>
                    )}
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
