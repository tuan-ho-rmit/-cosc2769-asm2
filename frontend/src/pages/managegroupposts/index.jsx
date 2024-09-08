import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  
import CreatePost from '../post/components/CreatePost';
import ListOfPostsDelete from '../post/components/ListOfPostsDelete';
import '../home/Home.css';
import { useAuth } from '../../provider/AuthProvider';

const ManageGroupPosts = () => {
    const { groupId } = useParams();  // get group Id from url
    const [posts, setPostList] = useState([]);
    const [content, setContent] = useState("");
    const [images, setImages] = useState([]);
    const { user } = useAuth();  
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');  
    const [groupAvatar, setGroupAvatar] = useState('');  
    const navigate = useNavigate();  

    // 그룹 정보 및 게시글 불러오기
    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const groupResponse = await fetch(`http://localhost:3000/api/groups/${groupId}`);
                if (!groupResponse.ok) {
                    throw new Error('Failed to fetch group data');
                }
                const groupData = await groupResponse.json();
                setGroupName(groupData.groupName);  
                setGroupDescription(groupData.description);  
                setGroupAvatar(groupData.avatar);  

                const postResponse = await fetch(`http://localhost:3000/api/groups/${groupId}/posts`);
                if (!postResponse.ok) {
                    throw new Error('Failed to fetch group posts');
                }
                const postData = await postResponse.json();
                setPostList(postData);  
            } catch (error) {
                console.error('Error fetching group data or posts:', error);
            }
        };

        fetchGroupData();
    }, [groupId]);

    // retrieve user data
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
                    // update status when data is finished loaded
                    setImages(images);
                }
            };

            reader.readAsDataURL(file);
        }
    }
    // View Members button
    const handleViewMembers = () => {
        navigate(`/viewmembers/${groupId}`); 
    };

    // add post
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
            groupId: groupId  
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
                
                setPostList([newPost, ...posts]);
                setContent("");
                setImages([]); 
            })
            .catch(error => console.error('Error creating post:', error));
    }


    // when change post content
    function handleInput(newPost) {
        setContent(newPost);
    }

    // delete post
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

    // edit post
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
                
                const updatedPostList = posts.map(post => post._id === id ? { ...post, content: updatedContent } : post);
                setPostList(updatedPostList);
            })
            .catch(error => console.error('Error updating post:', error));
        }
    }
    

    return (
        <div className="groupMainContent">
            {/* add group info section */}
            <div style={{ backgroundColor: '#393E46', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', textAlign: 'center', color: '#EEEEEE' }}>
                <img
                    src={groupAvatar}
                    alt={groupName}
                    style={{ width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto 1.5rem auto', display: 'block' }}  
                />
                <h1 style={{ color: '#FFD369', fontSize: '2rem' }}>{groupName}</h1>  
                <p style={{ fontSize: '1.2rem' }}>{groupDescription}</p>  

                {/* View Members button */}
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
                setPostList={setPostList} 
            />
        </div>
    );
};

export default ManageGroupPosts;
