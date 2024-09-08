import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // 그룹 ID와 경로 이동을 위해 사용
import CreatePost from '../post/components/CreatePost';
import ListOfPostsDelete from '../post/components/ListOfPostsDelete';
import '../home/Home.css';
import { useAuth } from '../../provider/AuthProvider';

const ManageGroupPosts = () => {
    const { groupId } = useParams();  // URL에서 그룹 ID를 가져옵니다
    const [posts, setPostList] = useState([]);
    const [content, setContent] = useState("");
    const [images, setImages] = useState([]);
    const { user } = useAuth();  // 세션 대신 useAuth를 사용하여 유저 정보 가져오기
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');  // 그룹 설명 추가
    const [groupAvatar, setGroupAvatar] = useState('');  // 그룹 이미지 추가
    const navigate = useNavigate();  // View Members 버튼 클릭 시 사용할 navigate

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
                setGroupDescription(groupData.description);  // 그룹 설명 설정
                setGroupAvatar(groupData.avatar);  // 그룹 이미지 설정

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
    // View Members 버튼 클릭 시 처리
    const handleViewMembers = () => {
        navigate(`/viewmembers/${groupId}`);  // viewmembers 경로로 이동
    };

    // 게시글 추가 처리
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
                // 새로 생성된 포스트를 다시 불러와 populate된 데이터를 상태에 반영
                setPostList([newPost, ...posts]); // 상태 업데이트
                setContent("");
                setImages([]); // 이미지 목록 초기화
            })
            .catch(error => console.error('Error creating post:', error));
    }


    // 게시글 내용 변경 시 처리
    function handleInput(newPost) {
        setContent(newPost);
    }

    // 게시글 삭제 처리
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

    // 게시글 수정 처리
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
            .then(async updatedPost => {
                // 업데이트된 게시글을 가져오지 않고 현재 상태를 바로 업데이트
                const updatedPostList = posts.map(post => post._id === id ? { ...post, content: updatedContent } : post);
                setPostList(updatedPostList);
            })
            .catch(error => console.error('Error updating post:', error));
        }
    }
    

    return (
        <div className="groupMainContent">
            {/* 상단에 그룹 정보 섹션 추가 */}
            <div style={{ backgroundColor: '#393E46', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', textAlign: 'center', color: '#EEEEEE' }}>
                <img
                    src={groupAvatar}
                    alt={groupName}
                    style={{ width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto 1.5rem auto', display: 'block' }}  // 이미지 가운데 정렬
                />
                <h1 style={{ color: '#FFD369', fontSize: '2rem' }}>{groupName}</h1>  {/* 글씨 크기 조금 키움 */}
                <p style={{ fontSize: '1.2rem' }}>{groupDescription}</p>  {/* 설명 글씨 크기 조금 키움 */}

                {/* View Members 버튼 추가 */}
                <button 
                    onClick={handleViewMembers} 
                    style={{ padding: '0.7rem 1.2rem', backgroundColor: '#FFD369', color: '#222831', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
                >
                    View Members
                </button>
            </div>

            <CreatePost
                text={content}
                onAdd={handleAddPost}
                onPostChange={handleInput}
                onImageUpload={handleImageUpload}
                user={user}
                showPrivacyToggle={false}
            />
            <ListOfPostsDelete
                posts={posts}
                onPostEdit={(id) => handleEditPost(id)}
                onPostDelete={(id) => handleDeletePost(id)}
                currentUserId={user ? user._id : null}
                user={user}
                setPostList={setPostList}  // 수정된 사항을 반영할 수 있도록 setPostList 전달
            />
        </div>
    );
};

export default ManageGroupPosts;
