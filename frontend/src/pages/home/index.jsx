import React, { useState, useEffect } from 'react';
import CreatePost from '../post/components/CreatePost';
import ListOfPosts from '../post/components/ListOfPosts';
import './Home.css';
import axios from 'axios';

export default function Home() {
  const [posts, setPostList] = useState([]);
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [user, setUser] = useState(null);

  // 모든 게시글 불러오기
  useEffect(() => {
    fetch('http://localhost:3000/api/posts')
      .then(response => response.json())
      .then(data => setPostList(data))
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  // 사용자 정보 불러오기
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/user', { withCredentials: true });
        if (response.data && response.data.user) {
          setUser(response.data.user);
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

  // 게시글 추가하기
  function handleAddPost() {
    if (!user) {
      alert('You need to log in to post.');
      return;
    }

    const newPostData = {
      userProfile: user.avatar || "/Images/example.jpg", // 사용자 프로필 이미지
      author: user.firstName + ' ' + user.lastName, // 사용자 이름
      content: content,
      images: images, // Base64 인코딩된 이미지 배열
    };

    fetch('http://localhost:3000/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPostData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setPostList([data, ...posts]);
        setContent("");
        setImages([]); // 이미지 목록 초기화
      })
      .catch(error => console.error('Error creating post:', error));
  }

  function handleInput(newPost) {
    setContent(newPost);
  }

  function handleDeletePost(id) {
    console.log(id); // 삭제할 포스트의 id를 출력하여 확인

    if (window.confirm("Are you sure you want to delete this post?")) {
        fetch(`http://localhost:3000/api/posts/${id}`, {
            method: 'DELETE',
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
        fetch(`http://localhost:3000/api/posts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: updatedContent, images: [] }),  // 필요한 데이터를 함께 전송
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(updatedPost => {
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
        onImageUpload={handleImageUpload} // 이미지 업로드 핸들러 전달
      />
      <ListOfPosts posts={posts} onPostEdit={handleEditPost} onPostDelete={handleDeletePost}/>
    </div>
  );
}
