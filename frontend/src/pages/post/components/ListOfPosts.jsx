import React, { useState, useEffect } from "react";
import DropDowns from "./DropDowns";
import { Link } from 'react-router-dom';
import CreateComment from "../../comment/components/CreateComment";
import ListOfComments from "../../comment/components/ListOfComments";
import { PostWithReactions } from "./PostWithReactions";

export default function ListOfPosts({ posts, onPostEdit, onPostDelete, user, setPostList }) {
    const currentUserId = user ? user.id : null;
    const [commentsByPost, setCommentsByPost] = useState({});
    const [editingPostId, setEditingPostId] = useState(null);
    const [updatedContent, setUpdatedContent] = useState("");
    const [updatedImages, setUpdatedImages] = useState([]);
    const [reactionCounts, setReactionCounts] = useState({});

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
        .then(() => {
            fetch(`http://localhost:3000/api/posts/${postId}`, {
                method: 'GET',
                credentials: 'include',
            })
            .then(response => response.json())
            .then(updatedPost => {
                setEditingPostId(null);
                setPostList(prevPosts => 
                    prevPosts.map(post => post._id === postId ? updatedPost : post)
                );
            });
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
        const displayImages = each.images.slice(0, 3);
        const remainingImagesCount = each.images.length - 3;
        const isAuthor = currentUserId === each.author._id;

        const commentsToShow = (commentsByPost[each._id] || []).slice(0, 3); // 최대 3개의 댓글만 보여줌
        const hasMoreComments = (commentsByPost[each._id] || []).length > 3;

        return (
            <div key={each._id} className="postContainer">
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

                {/* Modified Button - 작성자에게만 표시 */}
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
                    <ListOfComments 
                        postId={each._id} 
                        comments={commentsToShow} // 최대 3개 댓글만 표시
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
