import React, { useState, useEffect } from 'react';
import CreatePost from '../post/components/CreatePost';
import ListOfPosts from '../post/components/ListOfPosts';
import './Home.css';

export default function Home() {
  // Define state variables
  const [posts, setPostList] = useState([]); // List of posts
  const [content, setContent] = useState(""); // Post content
  const [images, setImages] = useState([]); // Images attached to a post
  const [user, setUser] = useState(null); // Current logged-in user
  const [isPrivate, setIsPrivate] = useState(false); // Privacy setting for posts

  // Fetch posts when the component is mounted
  useEffect(() => {
    const fetchPosts = async () => {
        try {
            console.log('Fetching posts...');
            const response = await fetch('http://localhost:3000/api/posts', {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                console.error('Error fetching posts, status:', response.status);
                throw new Error('Error fetching posts');
            }
            const data = await response.json();
            setPostList(data); // Update posts state
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    fetchPosts();
  }, []); // Run only on component mount

  // Fetch user information when the component is mounted
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/user', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        if (data && data.user) {
          setUser(data.user); // Update user state with user data
        } else {
          console.error('User data is missing from the response.');
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    fetchUser();
  }, []);

  // Handle image upload by reading the selected files
  function handleImageUpload(event) {
    const files = event.target.files;
    const images = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        images.push(e.target.result); // Push base64 encoded image to the images array
        if (images.length === files.length) {
          setImages(images); // Set the uploaded images once all files are processed
        }
      };

      reader.readAsDataURL(file); // Read file content as base64
    }
  }

  // Handle adding a new post
  function handleAddPost(images) {
    if (!user) {
        alert('You need to log in to post.');
        return;
    }

    const newPostData = {
        userProfile: user._id,
        userId: user._id,
        author: user._id,
        content: content,
        images: images,  // Use the updated image files from the CreatePost component
        isGroupPost: false,  // Flag for group posts, which is false here
        private: isPrivate  // Privacy setting
    };

    fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newPostData),  // Send the post data including the images
    })
    .then(response => response.json())
    .then(newPost => {
        return fetch(`http://localhost:3000/api/posts/${newPost._id}`, {
            method: 'GET',
            credentials: 'include',
        });
    })
    .then(response => response.json())
    .then(populatedPost => {
        setPostList([populatedPost, ...posts]);  // Add new post to the top of the post list
        setContent("");  // Clear the content input field
        setImages([]);  // Clear the images input
    })
    .catch(error => console.error('Error creating post:', error));
}

  // Handle deleting a post
  function handleDeletePost(id) {
    if (window.confirm("Are you sure you want to delete this post?")) {
      // Make a DELETE request to remove the post by ID
      fetch(`http://localhost:3000/api/posts/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
        .then(() => setPostList(posts.filter(post => post._id !== id))) // Filter out the deleted post
        .catch(error => console.error('Error deleting post:', error));
    }
  }

  // Handle editing a post
  function handleEditPost(id, updatedContent) {
    // Make a PUT request to update the post content
    fetch(`http://localhost:3000/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ content: updatedContent }), // Send the updated content as JSON
    })
    .then(response => response.json())
    .then(updatedPost => {
      setPostList(posts.map(post => post._id === id ? updatedPost : post)); // Replace the old post with the updated one
    })
    .catch(error => console.error('Error updating post:', error));
  }

  return (
    <div className="newFeedContent">
      {/* CreatePost component for creating a new post */}
      <CreatePost
        text={content}
        onAdd={handleAddPost}
        onPostChange={setContent}
        onImageUpload={handleImageUpload}
        user={user}
        isPrivate={isPrivate}
        setIsPrivate={setIsPrivate}
      />

      {/* ListOfPosts component for displaying the list of posts */}
      <ListOfPosts
        posts={posts}
        onPostEdit={handleEditPost}
        onPostDelete={handleDeletePost}
        currentUserId={user ? user._id : null}
        user={user}
        setPostList={setPostList}
      />
    </div>
  );
}
