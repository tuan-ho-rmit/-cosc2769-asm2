import React, { useEffect, useState } from 'react';
import CreatePost from '../../components/post/CreatePost';
import ListOfPosts from '../../components/post/ListOfPosts';
import './Home.css';

export default function Home() {
  const [posts, setPostList] = useState([]);
  const [content, setContent] = useState("");  // 변경된 변수명
  const [images, setImages] = useState([]);

  // 모든 게시글 불러오기
  useEffect(() => {
    fetch('http://localhost:3000/api/posts')
      .then(response => response.json())
      .then(data => setPostList(data))
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  // 게시글 추가하기
  function handleAddPost() {
    const newPostData = {
      userProfile: "/Images/example.jpg", // 기본 프로필 이미지
      content: content,  // 변경된 변수명 사용
      images: images,
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
        setPostList([data, ...posts]);  // 서버에서 반환된 새로운 Post를 추가
        setContent("");  // 입력값 초기화
        setImages([]);  // 이미지 목록 초기화
      })
      .catch(error => console.error('Error creating post:', error));
  }

  function handleInput(newPost) {
    setContent(newPost);  // 변경된 변수명 사용
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


  
  
  return (
    <div className="newFeedContent">
      <CreatePost text={content} onAdd={handleAddPost} onPostChange={handleInput} />
      <ListOfPosts posts={posts} onPostEdit={handleEditPost} onPostDelete={handleDeletePost} />
    </div>
  );
}
