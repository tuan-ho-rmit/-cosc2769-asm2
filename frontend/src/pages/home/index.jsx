import React from 'react'
import CreatePost from '../../components/post/CreatePost';
import ListOfPosts from '../../components/post/ListOfPosts';
import { useState } from 'react';
import './Home.css';


export default function Home() {

    const postList = [
        {
            id: 1,
            content: "Nature is incredibly diverse and awe-inspiring. From the towering mountains to the deep oceans, every aspect of nature has something unique to offer. In this post, we'll explore some of the most beautiful natural landscapes on Earth.",
            author: "John Doe",
            date: "2024-08-12",
            images: [
                "https://example.com/nature1.jpg",
                "https://example.com/nature2.jpg",
                "https://example.com/nature3.jpg",
            ]
        },
        {
            id: 2,
            content: "Technology is rapidly evolving, bringing about changes that were once thought to be science fiction. From AI and machine learning to quantum computing, let's discuss the future trends that will shape our world.",
            author: "Jane Smith",
            date: "2024-08-11",
            images: [
                "https://example.com/tech1.jpg",
                "https://example.com/tech2.jpg",
            ],
        },
        {
            id: 3,
            content: "Eating healthy doesn't have to be boring or difficult. In this post, we'll share some delicious and easy-to-make recipes that are both nutritious and tasty. Plus, we'll provide tips on how to maintain a balanced diet.",
            author: "Emily Brown",
            date: "2024-08-10",
            images: [
                "https://example.com/food1.jpg",
                "https://example.com/food2.jpg",
            ],
        },
        {
            id: 4,
            content: "Exercise is crucial for maintaining good health. Whether you prefer running, lifting weights, or practicing yoga, regular physical activity can help you feel better, sleep better, and reduce the risk of many chronic diseases.",
            author: "Michael Johnson",
            date: "2024-08-09",
            images: [
                "https://example.com/exercise1.jpg",
                "https://example.com/exercise2.jpg",
            ],
        },
        {
            id: 5,
            content: "Traveling opens your mind to new cultures, foods, and experiences. In this post, we'll explore some of the top travel destinations around the world that should be on every traveler's bucket list.",
            author: "Sarah Wilson",
            date: "2024-08-08",
            images: [
                "https://example.com/travel1.jpg",
                "https://example.com/travel2.jpg",
                "https://example.com/travel3.jpg",
            ],
        },
    ];
    
    

  const [posts, setPostList] = useState(postList);
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
