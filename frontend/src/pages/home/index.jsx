import React, { useState, useEffect } from 'react';
import CreatePost from '../../components/post/CreatePost';
import ListOfPosts from '../../components/post/ListOfPosts';
import './Home.css';

export default function Home() {
  const [posts, setPostList] = useState([]);
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);

  // 모든 게시글 불러오기
  useEffect(() => {
    fetch('http://localhost:3000/api/posts')
      .then(response => response.json())
      .then(data => setPostList(data))
      .catch(error => console.error('Error fetching posts:', error));
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
    const newPostData = {
      userProfile: "/Images/example.jpg", // 기본 프로필 이미지
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

  return (
    <div className="newFeedContent">
      <CreatePost
        text={content}
        onAdd={handleAddPost}
        onPostChange={handleInput}
        onImageUpload={handleImageUpload} // 이미지 업로드 핸들러 전달
      />
      <ListOfPosts posts={posts} />
    </div>
  );
}
