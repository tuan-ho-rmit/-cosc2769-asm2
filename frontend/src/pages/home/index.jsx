import React, { useState, useEffect } from 'react';
import CreatePost from '../post/components/CreatePost';
import ListOfPosts from '../post/components/ListOfPosts';
import './Home.css';

export default function Home() {
  const [posts, setPostList] = useState([]);
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [user, setUser] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);

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
            setPostList(data); // posts 상태를 업데이트
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    fetchPosts();
}, []); // 빈 배열 의존성: 처음 마운트 될 때만 실행
  
  // 사용자 정보 불러오기
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/user', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
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
    const images = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        images.push(e.target.result);
        if (images.length === files.length) {
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

    const newPostData = {
        userProfile: user._id,
        userId: user._id,
        author: user._id,
        content: content,
        images: images,
        isGroupPost: false,
        private: isPrivate 
    };

    fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newPostData),
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
        setPostList([populatedPost, ...posts]);
        setContent("");
        setImages([]);
    })
    .catch(error => console.error('Error creating post:', error));
  }

  function handleDeletePost(id) {
    if (window.confirm("Are you sure you want to delete this post?")) {
      fetch(`http://localhost:3000/api/posts/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
        .then(() => setPostList(posts.filter(post => post._id !== id)))
        .catch(error => console.error('Error deleting post:', error));
    }
  }

  function handleEditPost(id, updatedContent) {
    fetch(`http://localhost:3000/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ content: updatedContent }),
    })
    .then(response => response.json())
    .then(updatedPost => {
      setPostList(posts.map(post => post._id === id ? updatedPost : post));
    })
    .catch(error => console.error('Error updating post:', error));
  }

  return (
    <div className="newFeedContent">
      <CreatePost
        text={content}
        onAdd={handleAddPost}
        onPostChange={setContent}
        onImageUpload={handleImageUpload}
        user={user}
        isPrivate={isPrivate}
        setIsPrivate={setIsPrivate}
      />
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
