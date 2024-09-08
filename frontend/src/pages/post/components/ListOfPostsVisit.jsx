import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import ListOfCommentsView from "../../comment/components/ListOfCommentsView";
import '../../../components/button/index.css';

export default function ListOfPostsVisit({ posts }) {
    const [commentsByPost, setCommentsByPost] = useState({});
    const [reactionCounts, setReactionCounts] = useState({});

    useEffect(() => {
        if (posts.length > 0) {
            const fetchData = async () => {
                await Promise.all(posts.map(async (post) => {
                    await fetchComments(post._id);
                    await fetchReactionCounts(post._id);
                }));
            };

            fetchData();
        }
    }, [posts]);

    const fetchComments = async (postId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/posts/${postId}/comments`, {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Error fetching comments');
            }
            const data = await response.json();
            setCommentsByPost(prev => ({ ...prev, [postId]: data }));
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
            setReactionCounts(prev => ({ ...prev, [postId]: data }));
        } catch (error) {
            console.error('Error fetching reaction counts:', error);
        }
    };

    const postItems = posts.map((each) => {
        const isGroupPost = each.isGroupPost;
        const groupName = isGroupPost && each.groupId && each.groupId.groupName ? each.groupId.groupName : 'Unknown Group';
        const groupAvatar = isGroupPost && each.groupId && each.groupId.avatar ? each.groupId.avatar : 'default-group-avatar-url.jpg';

        const displayImages = each.images.slice(0, 3);
        const remainingImagesCount = each.images.length - 3;

        const commentsToShow = (commentsByPost[each._id] || []).slice(0, 3);
        const hasMoreComments = (commentsByPost[each._id] || []).length > 3;

        return (
            <div key={each._id} className="postContainer">
                {isGroupPost && (
                    <div className="groupInfo">
                        <div className="groupAvatar">
                            <img src={groupAvatar} alt="Group Avatar" className="w-8 h-8 rounded-full" />
                        </div>
                        <div className="groupName">
                            <p>{groupName}</p>
                        </div>
                    </div>
                )}
                <div className="postHeader">
                    <div className="imgContainer">
                        <Link to={`/user/${each.author._id}`}>
                            <div className='mx-4'>
                                <img
                                    src={each.userProfile.avatar || 'default-avatar-url.jpg'}
                                    className='w-10 h-10 ring-yellow ring-2 rounded-full'
                                    alt='rounded-avatar'
                                />
                            </div>
                        </Link>
                    </div>
                    <div className="postInfo">
                        <Link to={`/user/${each.author._id}`}>
                            <div className="userName">
                                <p>{each.author.firstName} {each.author.lastName || "Anonymous"}</p>
                            </div>
                        </Link>
                        <div className="postDate">
                            <p>{new Date(each.date).toLocaleString()}</p>
                        </div>
                        {each.private && (
                            <div className="privacyBadge">
                                <p>Friends Only</p>
                            </div>
                        )}
                    </div>
                </div>

                <Link to={`/post/${each._id}`}>
                    <div className="postContent">
                        {each.content}
                    </div>
                    <div className="postContentImg">
                        {displayImages.map((image, idx) => (
                            <div key={idx} className="imageWrapper">
                                <img src={image} alt={`Post image ${idx}`} className="postImage" />
                                {idx === 2 && remainingImagesCount > 0 && (
                                    <div className="imageOverlay">
                                        +{remainingImagesCount} Pictures
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Link>

                <div className="reactionCounts">
                    {Object.entries(reactionCounts[each._id] || {}).map(([type, count]) => (
                        <div key={type} className="reactionCount" style={{ color: 'black' }}>
                            {type}: {count}
                        </div>
                    ))}
                </div>

                <hr className="solidPost"></hr>

                <div className="commentsSection">
                    <ListOfCommentsView 
                        postId={each._id} 
                        comments={commentsToShow} 
                    />
                    {hasMoreComments && (
                        <Link to={`/post/${each._id}`}>
                            <button className="seeMoreComments">See more comments</button>
                        </Link>
                    )}
                </div>
            </div>
        );
    });

    return (
        <div className="postListContainer">
            {postItems}
        </div>
    );
}
