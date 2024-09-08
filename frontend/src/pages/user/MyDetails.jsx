import React, { useState, useEffect } from "react";
import CreatePost from '../post/components/CreatePost';
import ListOfPosts from '../post/components/ListOfPosts';
import './UserDetails.css';
import { useAuth } from "../../provider/AuthProvider";

export default function MyDetails() {
    const {user} = useAuth()
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [userId, setUserId] = useState(null);
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState("");

    // Fetch user details from localStorage
    useEffect(() => {
        if (user) {
            setName(`${user.firstName} ${user.lastName}`);
            setAvatar(user.avatar || "/Images/default-avatar.png");
            setUserId(user.id);
        }
    }, []);

    // Fetch user's posts, including group post data
    useEffect(() => {
        if (userId) {
            console.log('Fetching posts for user:', userId);
            
            fetch(`http://localhost:3000/api/posts/user/${userId}`, {
                method: 'GET',
                credentials: 'include',
            })
            .then(response => {
                console.log('Response status:', response.status);
                return response.json();
            })
            .then(data => {
                console.log('Fetched posts data:', data); // 데이터 확인
                setPosts(data); // Ensure groupId is populated here
            })
            .catch(error => console.error('Error fetching user posts:', error));
        }
    }, [userId]);
    

    const handleAddPost = () => {
        if (!user) return;

        const newPostData = {
            userProfile: user._id,
            userId: user._id,
            author: user._id,
            content: content,
            images: [],
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
        .then(post => {
            fetch(`http://localhost:3000/api/posts/${post._id}`, {
                method: 'GET',
                credentials: 'include',
            })
            .then(response => response.json())
            .then(updatedPost => {
                setPosts([updatedPost, ...posts]);
                setContent("");
            })
            .catch(error => console.error('Error fetching updated post:', error));
        })
        .catch(error => console.error('Error creating post:', error));
    };

    const handleEditPost = (id, updatedContent) => {
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
            // Fetch the updated post to ensure group data is included
            fetch(`http://localhost:3000/api/posts/${updatedPost._id}`, {
                method: 'GET',
                credentials: 'include',
            })
            .then(response => response.json())
            .then(freshPost => {
                setPosts(posts.map(post => post._id === id ? freshPost : post));
            })
            .catch(error => console.error('Error fetching updated post:', error));
        })
        .catch(error => console.error('Error updating post:', error));
    };

    const handleDeletePost = (id) => {
        fetch(`http://localhost:3000/api/posts/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        })
        .then(() => setPosts(posts.filter(post => post._id !== id)))
        .catch(error => console.error('Error deleting post:', error));
    };

    return (
        <div>
            <div className="mainContent">
                <div className="userProfileContainer">
                    <span className="profileImgContainer">
                        <img src={avatar} alt="userImage" className="profileImg" />
                    </span>
                    <span className="userName">
                            <p>{name}</p>
                    </span>
                </div>
            </div>
            <hr className="solid"></hr>

            <div className="newFeedContent">
                <CreatePost
                    text={content}
                    onAdd={handleAddPost}
                    onPostChange={setContent}
                    onImageUpload={() => {}} // 이미지 업로드 핸들러
                    user={user}
                />
                <ListOfPosts 
                    posts={posts} 
                    onPostEdit={handleEditPost} 
                    onPostDelete={handleDeletePost} 
                    user={user} 
                    setPostList={setPosts} // 그룹 포스트 업데이트 후 반영
                />
            </div>
        </div>
    );
}
