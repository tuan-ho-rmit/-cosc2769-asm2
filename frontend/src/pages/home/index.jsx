import React, { useState, useEffect } from 'react';
import CreatePost from '../post/components/CreatePost';
import ListOfPosts from '../post/components/ListOfPosts';
import './Home.css';

export default function Home() {
  const [posts, setPostList] = useState([]);
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [user, setUser] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false); // 새로운 상태 추가

  // 모든 게시글 불러오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('Fetching posts...');
        const response = await fetch('http://localhost:3000/api/posts', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Error fetching posts');
        }
        const data = await response.json();
        console.log('Fetched posts:', data);
        setPostList(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  // 사용자 정보 불러오기
  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('Fetching user information...');
        const response = await fetch('http://localhost:3000/api/auth/user', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        console.log('Fetched user:', data.user);
        if (data && data.user) {
          setUser(data.user);
        } else {
          console.error('User data is missing from the response.');
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    fetchUser();
  }, []);

  function handleImageUpload(event) {
    const files = event.target.files;
    const fileReaders = [];
    const images = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        images.push(e.target.result);
        if (images.length === files.length) {
          // 모든 파일이 로드된 후 상태를 업데이트
          setImages(images);
        }
      };

      reader.readAsDataURL(file);
    }
  }

  function handleAddPost() {
    if (!user) {
        alert('You need to log in to post.');
        return;
    }

    // 디버깅 로그 추가
    console.log('Creating post with isPrivate:', isPrivate);

    const newPostData = {
        userProfile: user._id,
        userId: user._id,
        author: user._id,
        content: content,
        images: images,
        isGroupPost: false,
        private: isPrivate // Ensure this is correctly passed from the state
    };

    fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newPostData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(newPost => {
        console.log('New post created:', newPost);
        return fetch(`http://localhost:3000/api/posts/${newPost._id}`, {
            method: 'GET',
            credentials: 'include',
        });
    })
    .then(response => response.json())
    .then(populatedPost => {
        console.log('Populated new post:', populatedPost);
        setPostList([populatedPost, ...posts]);
        setContent("");
        setImages([]);
    })
    .catch(error => console.error('Error creating post:', error));
  }



  function handleInput(newPost) {
    setContent(newPost);
  }

  function handleDeletePost(id) {
    console.log('Deleting post with ID:', id);

    if (window.confirm("Are you sure you want to delete this post?")) {
      fetch(`http://localhost:3000/api/posts/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          setPostList(posts.filter(post => post._id !== id));
        })
        .catch(error => console.error('Error deleting post:', error));
    }
  }

  function handleEditPost(id) {
    const updatedContent = prompt("Edit your post:");
    if (updatedContent !== null) {
      console.log('Editing post with ID:', id);
      fetch(`http://localhost:3000/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ content: updatedContent, images: [] }),  // 필요한 데이터를 함께 전송
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(updatedPost => {
          console.log('Updated post:', updatedPost);
          setPostList(posts.map(post => post._id === id ? updatedPost : post));
        })
        .catch(error => console.error('Error updating post:', error));
    }
  }

  return (
    <div className="newFeedContent">
      <CreatePost
        text={content}
        onAdd={handleAddPost}
        onPostChange={handleInput}
        onImageUpload={handleImageUpload}
        user={user}
        isPrivate={isPrivate} // 추가된 부분
        setIsPrivate={setIsPrivate} // 추가된 부분
      />
      <ListOfPosts
        posts={posts}
        onPostEdit={handleEditPost}
        onPostDelete={handleDeletePost}
        currentUserId={user ? user._id : null}
        user={user}
      />
    </div>
  );
}
