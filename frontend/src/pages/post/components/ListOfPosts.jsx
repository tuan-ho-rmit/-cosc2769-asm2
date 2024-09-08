import React, { useState, useEffect, useRef } from "react";
import DropDowns from "./DropDowns";
import { Link } from 'react-router-dom';
import CreateComment from "../../comment/components/CreateComment";
import ListOfComments from "../../comment/components/ListOfComments";
import { PostWithReactions } from "./PostWithReactions";
import '../../../components/button/index.css';
// import Button from "../../../../components/button/index.jsx";

export default function ListOfPosts({ posts, onPostEdit, onPostDelete, user, setPostList }) {
    const currentUserId = user ? user.id : null;  // Retrieves the current user's ID, or null if not logged in
    const [commentsByPost, setCommentsByPost] = useState({});  // State to store comments for each post
    const [editingPostId, setEditingPostId] = useState(null);  // State to track which post is being edited
    const [updatedContent, setUpdatedContent] = useState("");  // State to store the updated post content during editing
    const [updatedImages, setUpdatedImages] = useState([]);  // State to store updated images during post editing
    const [reactionCounts, setReactionCounts] = useState({});  // State to store reaction counts for each post
    const fileInputRef = useRef(null);  // Reference for file input to upload images

    useEffect(() => {
        if (posts.length > 0) {
            const fetchData = async () => {
                await Promise.all(posts.map(async (post) => {
                    await fetchComments(post._id);  // Fetch comments for each post
                    await fetchReactionCounts(post._id);  // Fetch reaction counts for each post
                }));
            };

            fetchData();
        }
    }, [posts]);  // Run when the list of posts changes

    // Fetch comments for a specific post
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
            setCommentsByPost(prev => ({ ...prev, [postId]: data }));  // Update the commentsByPost state for this post
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    // Fetch reaction counts for a specific post
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
            setReactionCounts(prev => ({ ...prev, [postId]: data }));  // Update the reaction counts for this post
        } catch (error) {
            console.error('Error fetching reaction counts:', error);
        }
    };

    // Handle adding a new comment
    const handleAddComment = (postId, newCommentText) => {
        const newComment = { content: newCommentText, id: Date.now(), author: user };  // Create a new comment object
        setCommentsByPost(prevComments => ({
            ...prevComments,
            [postId]: [...(prevComments[postId] || []), newComment]  // Add the new comment to the post's comment list
        }));

        fetch(`http://localhost:3000/api/posts/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(newComment)  // Send the new comment to the server
        })
        .then(response => response.json())
        .then(() => {
            fetchComments(postId);  // Fetch updated comments for the post
        })
        .catch(error => console.error('Error adding comment:', error));
    };

    // Handle editing a comment
    const handleEditComment = (postId, commentId, newContent) => {
        fetch(`http://localhost:3000/api/posts/${postId}/comments/${commentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ content: newContent })  // Send the updated comment content to the server
        })
        .then(response => response.json())
        .then(() => {
            fetchComments(postId);  // Fetch updated comments after editing
        })
        .catch(error => console.error('Error editing comment:', error));
    };

    // Handle deleting a comment
    const handleDeleteComment = (postId, commentId) => {
        fetch(`http://localhost:3000/api/posts/${postId}/comments/${commentId}`, {
            method: 'DELETE',
            credentials: 'include',
        })
        .then(() => {
            fetchComments(postId);  // Fetch updated comments after deletion
        })
        .catch(error => console.error('Error deleting comment:', error));
    };

    // Handle editing a post
    const handleEditPost = (postId) => {
        setEditingPostId(postId);  // Set the ID of the post being edited
        const postToEdit = posts.find(post => post._id === postId);  // Find the post to edit
        setUpdatedContent(postToEdit.content);  // Set the current content to edit
        setUpdatedImages(postToEdit.images);  // Set the current images to edit
    };

    // Save the edited post
    const handleSaveEditPost = (postId) => {
        fetch(`http://localhost:3000/api/posts/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ content: updatedContent, images: updatedImages })  // Send the updated post data to the server
        })
        .then(response => response.json())
        .then(async () => {
            const updatedPost = await fetch(`http://localhost:3000/api/posts/${postId}`, {
                method: 'GET',
                credentials: 'include',
            }).then(response => response.json());

            if (typeof updatedPost.groupId === 'string') {  // If the groupId is a string, fetch group data
                const groupResponse = await fetch(`http://localhost:3000/api/groups/${updatedPost.groupId}`);
                const groupData = await groupResponse.json();
                updatedPost.groupId = groupData;  // Set the group data in the updated post
            }

            setEditingPostId(null);  // Exit editing mode
            setPostList(prevPosts => 
                prevPosts.map(post => post._id === postId ? updatedPost : post)  // Update the post list with the edited post
            );
        })
        .catch(error => console.error('Error updating post:', error));
    };

    // Handle image upload for a post being edited
    const handleImageChange = (event) => {
        const files = event.target.files;
        const images = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = (e) => {
                images.push(e.target.result);  // Add the image preview
                if (images.length === files.length) {
                    setUpdatedImages(images);  // Update the state with all the selected images
                }
            };

            reader.readAsDataURL(file);
        }
    };

    // Handle removing an image from the edit list
    const handleRemoveImage = (imageIndex) => {
        setUpdatedImages(updatedImages.filter((_, idx) => idx !== imageIndex));  // Remove the image at the specified index
    };

    // Refresh reaction counts when a reaction is updated
    const updateReactionCounts = (postId) => {
        fetchReactionCounts(postId);  // Fetch updated reaction counts
    };

    // Render each post with the relevant information
    const postItems = posts.map((each) => {
        const isGroupPost = each.isGroupPost;  // Check if the post is a group post
        const groupName = isGroupPost && each.groupId && each.groupId.groupName ? each.groupId.groupName : 'Unknown Group';  // Get group name or set default
        const groupAvatar = isGroupPost && each.groupId && each.groupId.avatar ? each.groupId.avatar : 'default-group-avatar-url.jpg';  // Get group avatar or set default

        const displayImages = each.images.slice(0, 3);  // Limit images to display only the first 3
        const remainingImagesCount = each.images.length - 3;  // Calculate the number of remaining images not displayed
        const isAuthor = currentUserId === each.author._id;  // Check if the current user is the author of the post

        const commentsToShow = (commentsByPost[each._id] || []).slice(0, 3);  // Show the first 3 comments
        const hasMoreComments = (commentsByPost[each._id] || []).length > 3;  // Check if there are more than 3 comments

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
                    {isAuthor && (
                        <div className="dropDown">
                            <DropDowns
                                onEdit={() => handleEditPost(each._id)}  // Trigger post editing
                                onDelete={() => onPostDelete(each._id)}  // Trigger post deletion
                            />
                        </div>
                    )}
                </div>
                
                {editingPostId === each._id ? (  // Render post edit form if the post is being edited
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
                            {each.content}  {/* Display the post content */}
                        </div>
                        <div className="postContentImg">
                            {displayImages.map((image, idx) => (
                                <div key={idx} className="imageWrapper">
                                    <img src={image} alt={`Post image ${idx}`} className="postImage" />
                                    {idx === 2 && remainingImagesCount > 0 && (
                                        <div className="imageOverlay">
                                            +{remainingImagesCount} Pictures  {/* Display the number of additional images */}
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
                            {type}: {count}  {/* Display the reaction counts */}
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
                        <PostWithReactions postId={each._id} onReactionUpdate={() => updateReactionCounts(each._id)} />  {/* Component to handle post reactions */}
                    </span>
                    <span className="commentBtn">
                        <button>Comment</button>  {/* Button to open the comment section */}
                    </span>
                </div>
                <hr className="solidPost"></hr>
                <div className="commentsSection">
                    <ListOfComments 
                        postId={each._id} 
                        comments={commentsToShow} 
                        onEditComment={handleEditComment} 
                        onDeleteComment={handleDeleteComment} 
                        currentUserId={currentUserId}
                    />
                    {hasMoreComments && (
                        <Link to={`/post/${each._id}`}>
                            <button className="seeMoreComments">See more comments</button>  {/* Button to view more comments */}
                        </Link>
                    )}
                    <CreateComment onAddComment={(text) => handleAddComment(each._id, text)} user={user} />  {/* Component to add a new comment */}
                </div>
            </div>
        );
    });

    return (
        <div className="postListContainer">
            {postItems}  {/* Render the list of posts */}
        </div>
    );
}
