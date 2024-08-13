import React from 'react'
import CreatePost from '../../components/post/CreatePost';
import ListOfPosts from '../../components/post/ListOfPosts';
import { useState } from 'react';
import './Home.css';

export default function Home() {

  const [posts, setPostList] = useState([]);
  const [text, setText] = useState("");
  // 이미지는 나중에

  function handleAddPost() {
      setPostList([...posts, text])
      setText("")
  }

  function handleInput(newPost) {
      setText(newPost)
  }

  function handleEditPost(index) {
    const newText = prompt("Edit your post:", posts[index]);
    if (newText !== null) {
        const updatedPosts = [...posts];
        updatedPosts[index] = newText;
        setPostList(updatedPosts);
    }
}

function handleDeletePost(index) {
    if (window.confirm("Are you sure you want to delete this post?")) {
        const updatedPosts = posts.filter((_, i) => i !== index);
        setPostList(updatedPosts);
    }
}

  return (
      <div className="mainContent">
          <CreatePost text={text} onAdd={handleAddPost} onPostChange={handleInput}/>
          <ListOfPosts posts={posts} onPostEdit={handleEditPost} onPostDelete={handleDeletePost}/>
      </div>
  )
}
