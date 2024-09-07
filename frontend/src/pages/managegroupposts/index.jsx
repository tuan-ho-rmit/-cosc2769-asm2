import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from 'react-router-dom';
import CreateComment from "../../pages/comment/components/CreateComment.jsx";
import ListOfComments from "../../pages/comment/components/ListOfComments";
import { PostWithReactions } from "../../pages/post/components/PostWithReactions.jsx";
import '../../components/button/index.css';

export default function ManageGroupPosts({ user }) {
    const { groupName } = useParams(); // 그룹 이름을 URL에서 받아옴
    const [posts, setPosts] = useState([]);
    const [commentsByPost, setCommentsByPost] = useState({});
    const [editingPostId, setEditingPostId] = useState(null);
    const [updatedContent, setUpdatedContent] = useState("");
    const [updatedImages, setUpdatedImages] = useState([]);
    const [reactionCounts, setReactionCounts] = useState({});
    const fileInputRef = useRef(null);
    const currentUserId = user ? user.id : null;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/groups/manage-group-posts/${groupName}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data = await response.json();
                setPosts(data);  // 받아온 데이터를 상태로 설정
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, [groupName]);

    const fetchComments = async (postId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/posts/${postId}/comments`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Error fetching comments');
            }
            const data = await response.json();
            setCommentsByPost((prev) => ({ ...prev, [postId]: data }));
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const fetchReactionCounts = async (postId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/posts/${postId}/reactions/count`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Error fetching reaction counts');
            }
            const data = await response.json();
            setReactionCounts((prev) => ({ ...prev, [postId]: data }));
        } catch (error) {
            console.error('Error fetching reaction counts:', error);
        }
    };

    const handleDeletePost = async (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Failed to delete post');
                }
                setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    };

    const handleImageChange = (event) => {
        const files = event.target.files;
        const images = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = (e) => {
                images.push(e.target.result);
                if (images.length === files.length) {
                    setUpdatedImages(images);
                }
            };

            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (imageIndex) => {
        setUpdatedImages(updatedImages.filter((_, idx) => idx !== imageIndex));
    };

    const postItems = posts.map((post) => {
        const commentsToShow = (commentsByPost[post._id] || []).slice(0, 3);
        const hasMoreComments = (commentsByPost[post._id] || []).length > 3;

        return (
            <div key={post._id} className="postContainer">
                <div className="postHeader">
                    <Link to={`/user/${post.author._id}`}>
                        <div className="imgContainer">
                            <img src={post.userProfile.avatar || 'default-avatar-url.jpg'} className='w-10 h-10 ring-yellow ring-2 rounded-full' alt='User Avatar' />
                        </div>
                    </Link>
                    <div className="postInfo">
                        <Link to={`/user/${post.author._id}`}>
                            <div className="userName">
                                <p>{post.author.firstName} {post.author.lastName || "Anonymous"}</p>
                            </div>
                        </Link>
                        <div className="postDate">
                            <p>{new Date(post.date).toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="postActions">
                        <button
                            onClick={() => handleDeletePost(post._id)}
                            style={{
                                backgroundColor: 'red',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                cursor: 'pointer',
                                position: 'absolute',
                                right: '20px',
                                top: '10px',
                                borderRadius: '4px'
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>

                <Link to={`/post/${post._id}`}>
                    <div className="postContent">{post.content}</div>
                </Link>

                <div className="reactionCounts">
                    {Object.entries(reactionCounts[post._id] || {}).map(([type, count]) => (
                        <div key={type} className="reactionCount">
                            {type}: {count}
                        </div>
                    ))}
                </div>

                {/* <hr />
                <div className="commentsSection">
                    <ListOfComments postId={post._id} comments={commentsToShow} />
                    {hasMoreComments && (
                        <Link to={`/post/${post._id}`}>
                            <button>See more comments</button>
                        </Link>
                    )}
                    <CreateComment onAddComment={(text) => handleAddComment(post._id, text)} user={user} />
                </div> */}
            </div>
        );
    });

    return (
        <div className="postListContainer">
            {/* <h1>Manage Posts for {groupName}</h1> */}
            {posts.length > 0 ? postItems : <p>No posts available for this group.</p>}
        </div>
    );
}
