import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import Slider from 'react-slick';
import CreateComment from '../comment/components/CreateComment';
import ListOfComments from '../comment/components/ListOfComments';
import { PostWithReactions } from './components/PostWithReactions';
import DropDowns from './components/DropDowns';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './PostDetail.css';

export default function PostDetail() {
  const { id: postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [editedImages, setEditedImages] = useState([]);
  const [reactionCounts, setReactionCounts] = useState({}); // reaction 개수 상태 추가

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }

    fetchPostDetails(postId);
    fetchComments(postId);
    fetchReactionCounts(postId); // 리액션 개수 가져오기
  }, [postId]);

  const fetchPostDetails = async (postId) => {
    try {
        const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Error fetching the post');
        }

        const data = await response.json();
        console.log("Fetched post details:", data);

        // groupId가 문자열인지 확인
        if (typeof data.groupId === 'string') {
            console.log("Group ID is still a string:", data.groupId);

            // 문자열로 되어 있을 경우, 그룹 정보를 다시 요청
            const groupResponse = await fetch(`http://localhost:3000/api/groups/${data.groupId}`, {
                method: 'GET',
                credentials: 'include',
            });

            const groupData = await groupResponse.json();
            data.groupId = groupData;  // groupId를 객체로 교체
        }

        setPost(data);
        setEditedContent(data.content);
        setEditedImages(data.images);
    } catch (error) {
        console.error('Error fetching the post:', error);
    }
};



  const fetchComments = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${postId}/comments`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = (newCommentText) => {
    const newComment = { content: newCommentText, author: user };
    setComments([...comments, newComment]);

    fetch(`http://localhost:3000/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(newComment),
    })
      .then(response => response.json())
      .then(() => {
        fetchComments(postId);
      })
      .catch(error => console.error('Error adding comment:', error));
  };

  const handleEditComment = (postId, commentId, newContent) => {
    fetch(`http://localhost:3000/api/posts/${postId}/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ content: newContent }),
    })
      .then(response => response.json())
      .then(() => {
        fetchComments(postId);
      })
      .catch(error => console.error('Error editing comment:', error));
  };

  const handleDeleteComment = (postId, commentId) => {
    console.log(`Deleting comment with postId: ${postId} and commentId: ${commentId}`);

    fetch(`http://localhost:3000/api/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then(() => {
        fetchComments(postId);
      })
      .catch(error => console.error('Error deleting comment:', error));
  };

  const handleSavePost = () => {
    fetch(`http://localhost:3000/api/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ content: editedContent, images: editedImages }),
    })
      .then(response => response.json())
      .then(() => {
        // 업데이트된 포스트 다시 가져오기
        fetchPostDetails(postId); // 업데이트 후 다시 데이터 불러오기
        setIsEditing(false);
      })
      .catch(error => console.error('Error updating post:', error));
  };
  

  const handleDeletePost = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      fetch(`http://localhost:3000/api/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
        .then(() => {
          window.location.href = '/';
        })
        .catch(error => console.error('Error deleting post:', error));
    }
  };

  const fetchReactionCounts = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${postId}/reactions/count`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      setReactionCounts(data);
    } catch (error) {
      console.error('Error fetching reaction counts:', error);
    }
  };

  const updateReactionCounts = () => {
    fetchReactionCounts(postId);
  };

  if (!post) return <div>Loading...</div>;

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="postDetailContainer">
        {/* 그룹 포스트인 경우 그룹 정보 렌더링 */}
  {post.groupId && (
    <div className="groupInfo">
      <div className="groupAvatar">
        <img 
          src={post.groupId.avatar || 'default-group-avatar-url.jpg'} 
          alt="Group Avatar" 
          className="w-10 h-10 rounded-full" 
        />
      </div>
      <div className="groupName">
        <p>{post.groupId.groupName}</p>
      </div>
    </div>
  )}
      <div className="postHeader">
        <div className="imgContainer">
          <div className='mx-4'>
            <img 
              src={post.author?.avatar || 'default-avatar-url.jpg'}
              className='w-10 h-10 ring-yellow ring-2 rounded-full' 
              alt='rounded-avatar'
            />
          </div>
        </div>
        <div className="postInfo">
          <div className="userName">
            <p>{post.author?.firstName} {post.author?.lastName}</p>
          </div>
          <div className="postDate">
            <p>{new Date(post.date).toLocaleString()}</p>
          </div>
        </div>
        
        {user && user.id === post.author?._id && (
          <div className="dropDown">
            <DropDowns
              onEdit={() => setIsEditing(true)}
              onDelete={handleDeletePost}
            />
          </div>
        )}
      </div>
      
      <div className="postContent">
        {isEditing ? (
          <input
            type="text"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="editInput"
          />
        ) : (
          <p>{post.content}</p>
        )}
      </div>
      
      <div className="reactionCounts">
        {Object.entries(reactionCounts).map(([type, count]) => (
          <div key={type} className="reactionCount">
            {type}: {count}
          </div>
        ))}
      </div>
      {post.images && post.images.length > 0 && (
        <div className="imageSlider">
          <Slider {...settings}>
            {post.images.map((image, index) => (
              <div key={index}>
                <img src={image} alt={`Slide ${index}`} className="postImage" />
              </div>
            ))}
          </Slider>
        </div>
      )}

      {/* Modified History Button - 작성자에게만 표시 */}
      {user && user.id === post.author?._id && post.history && post.history.length > 0 && (
        <div className="modifiedSection">
          <Link to={`/post/${postId}/history`}>
            <button>Show Modified History</button>
          </Link>
        </div>
      )}

      {isEditing && (
        <div className="editButtons">
          <button onClick={handleSavePost}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      )}

      <hr className="solidPost"></hr>
      <div className="likeAndComment">
        <span className="likeBtn">
          <PostWithReactions postId={postId} onReactionUpdate={updateReactionCounts} />
        </span>
        <span className="commentBtn">
          <button>Comment</button>
        </span>
      </div>
      <hr className="solidPost"></hr>
      
      {/* 댓글 섹션 추가 */}
      <div className="commentsSection">
        <ListOfComments 
          postId={postId} 
          comments={comments} 
          onEditComment={handleEditComment} 
          onDeleteComment={handleDeleteComment} 
          currentUserId={user ? user.id : null}
        />
        <CreateComment onAddComment={handleAddComment} user={user} />
      </div>
    </div>
  );
}
