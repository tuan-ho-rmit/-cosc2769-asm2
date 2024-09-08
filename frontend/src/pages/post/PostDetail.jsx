import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import Slider from 'react-slick';
import CreateComment from '../comment/components/CreateComment';
import ListOfComments from '../comment/components/ListOfComments';
import { PostWithReactions } from './components/PostWithReactions';
import DropDowns from './components/DropDowns';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './PostDetail.css';
import { useAuth } from '../../provider/AuthProvider';

// Main PostDetail component which handles displaying a post's details, comments, and reactions.
export default function PostDetail() {
  const {user} = useAuth(); // Get the current user from the authentication context
  const { id: postId } = useParams(); // Retrieve the post ID from the URL parameters
  const [post, setPost] = useState(null); // State to store post details
  const [comments, setComments] = useState([]); // State to store comments on the post
  const [isEditing, setIsEditing] = useState(false); // State to track if the post is being edited
  const [editedContent, setEditedContent] = useState(""); // State to track the content during editing
  const [editedImages, setEditedImages] = useState([]); // State to track the images during editing
  const [reactionCounts, setReactionCounts] = useState({}); // State to store the reaction counts for the post

  useEffect(() => {
    fetchPostDetails(postId); // Fetch post details when the component mounts or postId changes
    fetchComments(postId); // Fetch comments when the component mounts or postId changes
    fetchReactionCounts(postId); // Fetch reaction counts for the post
  }, [postId]);

  // Function to fetch post details, including handling group information if groupId is a string.
  const fetchPostDetails = async (postId) => {
    try {
        const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Error fetching the post');
        }

        const data = await response.json();
        console.log("Fetched post details:", data);

        // Check if groupId is still a string, and if so, fetch group details
        if (typeof data.groupId === 'string') {
            console.log("Group ID is still a string:", data.groupId);

            // Fetch group information to populate groupId field
            const groupResponse = await fetch(`http://localhost:3000/api/groups/${data.groupId}`, {
                method: 'GET',
                credentials: 'include',
            });

            const groupData = await groupResponse.json();
            data.groupId = groupData; // Replace groupId string with the actual group object
        }

        setPost(data); // Update post state
        setEditedContent(data.content); // Initialize content for editing
        setEditedImages(data.images); // Initialize images for editing
    } catch (error) {
        console.error('Error fetching the post:', error);
    }
  };

  // Function to fetch comments for a given post
  const fetchComments = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${postId}/comments`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      setComments(data); // Update comments state
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Function to handle adding a new comment
  const handleAddComment = (newCommentText) => {
    const newComment = { content: newCommentText, author: user };
    setComments([...comments, newComment]); // Optimistically update comments UI

    // Send new comment to the server
    fetch(`http://localhost:3000/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(newComment),
    })
      .then(response => response.json())
      .then(() => {
        fetchComments(postId); // Refresh comments after successful addition
      })
      .catch(error => console.error('Error adding comment:', error));
  };

  // Function to handle editing a comment
  const handleEditComment = (postId, commentId, newContent) => {
    fetch(`http://localhost:3000/api/posts/${postId}/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ content: newContent }),
    })
      .then(response => response.json())
      .then(() => {
        fetchComments(postId); // Refresh comments after editing
      })
      .catch(error => console.error('Error editing comment:', error));
  };

  // Function to handle deleting a comment
  const handleDeleteComment = (postId, commentId) => {
    console.log(`Deleting comment with postId: ${postId} and commentId: ${commentId}`);

    fetch(`http://localhost:3000/api/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then(() => {
        fetchComments(postId); // Refresh comments after deletion
      })
      .catch(error => console.error('Error deleting comment:', error));
  };

  // Function to handle saving an edited post
  const handleSavePost = () => {
    fetch(`http://localhost:3000/api/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ content: editedContent, images: editedImages }),
    })
      .then(response => response.json())
      .then(() => {
        fetchPostDetails(postId); // Refresh post details after updating
        setIsEditing(false); // Exit editing mode
      })
      .catch(error => console.error('Error updating post:', error));
  };

  // Function to handle deleting a post
  const handleDeletePost = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      fetch(`http://localhost:3000/api/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
        .then(() => {
          window.location.href = '/'; // Redirect after successful deletion
        })
        .catch(error => console.error('Error deleting post:', error));
    }
  };

  // Function to fetch reaction counts for a post
  const fetchReactionCounts = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${postId}/reactions/count`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      setReactionCounts(data); // Update reaction counts state
    } catch (error) {
      console.error('Error fetching reaction counts:', error);
    }
  };

  // Function to update reaction counts
  const updateReactionCounts = () => {
    fetchReactionCounts(postId);
  };

  // If post is not yet fetched, show loading state
  if (!post) return <div>Loading...</div>;

  // Slick slider settings for image slider
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="postDetailContainer">
        {/* Render group information if the post is a group post */}
        {post.groupId && (
          <div className="groupInfo">
            <div className="groupAvatar">
              <img 
                src={post.groupId.avatar || 'default-group-avatar-url.jpg'} 
                alt="Group Avatar" 
                className="w-10 h-10 rounded-full" 
              />
            </div>
            <div className="groupName">
              <p>{post.groupId.groupName}</p>
            </div>
          </div>
        )}
      <div className="postHeader">
        <div className="imgContainer">
          <div className='mx-4'>
            <img 
              src={post.author?.avatar || 'default-avatar-url.jpg'}
              className='w-10 h-10 ring-yellow ring-2 rounded-full' 
              alt='rounded-avatar'
            />
          </div>
        </div>
        <div className="postInfo">
          <div className="userName">
            <p>{post.author?.firstName} {post.author?.lastName}</p>
          </div>
          <div className="postDate">
            <p>{new Date(post.date).toLocaleString()}</p>
          </div>
        </div>

        {/* Show edit and delete options for the post's author */}
        {user && user.id === post.author?._id && (
          <div className="dropDown">
            <DropDowns
              onEdit={() => setIsEditing(true)} // Enter editing mode
              onDelete={handleDeletePost} // Delete post
            />
          </div>
        )}
      </div>
      
      <div className="postContent">
        {isEditing ? (
          <input
            type="text"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="editInput"
          />
        ) : (
          <p>{post.content}</p>
        )}
      </div>
      
      {/* Display reaction counts */}
      <div className="reactionCounts">
        {Object.entries(reactionCounts).map(([type, count]) => (
          <div key={type} className="reactionCount">
            {type}: {count}
          </div>
        ))}
      </div>
      {/* Image slider for post images */}
      {post.images && post.images.length > 0 && (
        <div className="imageSlider">
          <Slider {...settings}>
            {post.images.map((image, index) => (
              <div key={index}>
                <img src={image} alt={`Slide ${index}`} className="postImage" />
              </div>
            ))}
          </Slider>
        </div>
      )}

      {/* Show modified history button for post author */}
      {user && user.id === post.author?._id && post.history && post.history.length > 0 && (
        <div className="modifiedSection">
          <Link to={`/post/${postId}/history`}>
            <button>Show Modified History</button>
          </Link>
        </div>
      )}

      {/* Editing controls */}
      {isEditing && (
        <div className="editButtons">
          <button onClick={handleSavePost}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      )}

      <hr className="solidPost"></hr>
      <div className="likeAndComment">
        {/* Post reactions component */}
        <span className="likeBtn">
          <PostWithReactions postId={postId} onReactionUpdate={updateReactionCounts} />
        </span>
        <span className="commentBtn">
          <button>Comment</button>
        </span>
      </div>
      <hr className="solidPost"></hr>
      
      {/* Comments section */}
      <div className="commentsSection">
        <ListOfComments 
          postId={postId} 
          comments={comments} 
          onEditComment={handleEditComment} 
          onDeleteComment={handleDeleteComment} 
          currentUserId={user ? user.id : null}
        />
        <CreateComment onAddComment={handleAddComment} user={user} />
      </div>
    </div>
  );
}
