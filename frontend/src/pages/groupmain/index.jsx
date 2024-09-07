import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // 그룹 ID를 가져오기 위해 사용
import CreatePost from '../post/components/CreatePost';
import ListOfPosts from '../post/components/ListOfPosts';
import '../home/Home.css';

const GroupMain = () => {
    const { groupId } = useParams();  // URL에서 그룹 ID를 가져옵니다
    const [posts, setPostList] = useState([]);
    const [content, setContent] = useState("");
    const [images, setImages] = useState([]);
    const [user, setUser] = useState(null);
    const [groupName, setGroupName] = useState('');

    // 그룹 정보 및 게시글 불러오기
    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const groupResponse = await fetch(`http://localhost:3000/api/groups/${groupId}`);
                if (!groupResponse.ok) {
                    throw new Error('Failed to fetch group data');
                }
                const groupData = await groupResponse.json();
                setGroupName(groupData.groupName);  // 그룹 이름 설정
                
                const postResponse = await fetch(`http://localhost:3000/api/groups/${groupId}/posts`);
                if (!postResponse.ok) {
                    throw new Error('Failed to fetch group posts');
                }
                const postData = await postResponse.json();
                setPostList(postData);  // 그룹 게시글 설정
            } catch (error) {
                console.error('Error fetching group data or posts:', error);
            }
        };

        fetchGroupData();
    }, [groupId]);

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
            userProfile: user._id,
            userId: user._id,
            author: user._id,
            content: content,
            images: images,
            groupId: groupId  // 그룹 ID 추가
        };
    
        fetch(`http://localhost:3000/api/groups/${groupId}/posts`, {
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
            // 서버에서 새로 생성된 포스트를 다시 불러와 populate를 적용
            return fetch(`http://localhost:3000/api/posts/${newPost._id}`, {
                method: 'GET',
                credentials: 'include',
            });
        })
        .then(response => response.json())
        .then(populatedPost => {
            setPostList([populatedPost, ...posts]); // 상태 업데이트
            setContent("");
            setImages([]); // 이미지 목록 초기화
        })
        .catch(error => console.error('Error creating post:', error));
    }

    function handleInput(newPost) {
        setContent(newPost);
    }

    function handleDeletePost(id) {
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
            fetch(`http://localhost:3000/api/posts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ content: updatedContent, images: [] }),
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
        <div className="groupMainContent">
            {/* <h1>{groupName}</h1> */}
            <CreatePost
                text={content}
                onAdd={handleAddPost}
                onPostChange={handleInput}
                onImageUpload={handleImageUpload}
                user={user}
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
};

export default GroupMain;
