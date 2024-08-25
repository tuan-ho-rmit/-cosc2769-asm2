import React, { useState, useEffect } from "react";
import CreatePost from '../post/components/CreatePost'; // CreatePost 컴포넌트 임포트
import ListOfPosts from '../post/components/ListOfPosts'; // ListOfPosts 컴포넌트 임포트
import './UserDetails.css';

export default function MyDetails() {
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [userId, setUserId] = useState(null);
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState("");
    const [user, setUser] = useState(null);

    // Fetch user details from localStorage
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setName(`${storedUser.firstName} ${storedUser.lastName}`);
            setAvatar(storedUser.avatar || "/Images/default-avatar.png");
            setUserId(storedUser.id); // 유저 ID 설정
            setUser(storedUser); // 유저 정보 설정
        }
    }, []);

    // Fetch user's posts
    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:3000/api/posts/user/${userId}`, {
                method: 'GET',
                credentials: 'include',
            })
            .then(response => response.json())
            .then(data => setPosts(data))
            .catch(error => console.error('Error fetching user posts:', error));
        }
    }, [userId]);

    const handleInput = (newPost) => setContent(newPost);

    const handleAddPost = () => {
        if (!user) return;
    
        const newPostData = {
            userProfile: user._id, // 사용자 프로필 ID
            userId: user._id, // 사용자 ID
            author: user._id, // 작성자 ID
            content: content,
            images: [], // 이미지 배열
        };
    
        fetch('http://localhost:3000/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // 세션 쿠키를 포함하여 보냅니다.
            body: JSON.stringify(newPostData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error creating post');
            }
            return response.json();
        })
        .then(post => {
            // 새로 추가된 포스트에 대해 서버로부터 데이터를 다시 받아옵니다.
            fetch(`http://localhost:3000/api/posts/${post._id}`, {
                method: 'GET',
                credentials: 'include',
            })
            .then(response => response.json())
            .then(updatedPost => {
                setPosts([updatedPost, ...posts]);
                setContent(""); // 포스트 작성 후 입력 필드 초기화
            })
            .catch(error => console.error('Error fetching updated post:', error));
        })
        .catch(error => console.error('Error creating post:', error));
    };
    

    const handleEditPost = (id) => {
        // 포스트 편집 로직을 여기에 추가
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
                        {isEditing && (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="changeProfileImg"
                            />
                        )}
                    </span>
                    <span className="userName">
                        {isEditing ? (
                            <input
                                type="text"
                                value={name}
                                onChange={handleNameChange}
                                className="nameInput"
                            />
                        ) : (
                            <p>{name}</p>
                        )}
                        <button onClick={() => setIsEditing(!isEditing)} className="changeNameBtn">
                            <svg className="h-8 w-8 text-yellow-500" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                                <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                                <line x1="16" y1="5" x2="19" y2="8" />
                            </svg>
                        </button>
                    </span>
                    {isEditing && (
                        <span className="editBtn">
                            <button onClick={handleSaveChanges}>Save New Changes</button>
                        </span>
                    )}
                </div>
            </div>
            <hr className="solid"></hr>

            <div className="newFeedContent">
                <CreatePost
                    text={content}
                    onAdd={handleAddPost}
                    onPostChange={handleInput}
                    onImageUpload={() => {}} // 이미지 업로드 핸들러
                    user={user} // 현재 로그인된 유저 정보를 전달
                />
                <ListOfPosts posts={posts} onPostEdit={handleEditPost} onPostDelete={handleDeletePost} user={user} />
            </div>
        </div>
    );
}
