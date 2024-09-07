import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ListOfPosts from '../post/components/ListOfPosts'; // ListOfPosts 컴포넌트 임포트
import './UserDetails.css';
import CreateFriendRequest from "../friends/components/friendrequest/CreateFriendRequest.jsx";
import FriendRequestActions from "../friends/components/actions/FriendRequestActions.jsx";
import UnfriendAction from "../friends/components/actions/UnfriendAction.jsx";
import CancelRequestAction from "../friends/components/actions/CancelRequestAction.jsx";


export default function UserDetails() {
    const { userId } = useParams(); // URL에서 userId를 가져옵니다.
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const [currentUser, setCurrentUser] = useState(null); // 현재 로그인한 사용자 상태 추가
    const [friendRequest, setFriendRequest] = useState();
    const [areFriends, setAreFriends] = useState(false);
    const [userGroups, setUserGroups] = useState([]); // 사용자가 가입한 그룹 목록

    const fetchFriendRequest = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/friendrequest/single/${currentUser.id}/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
            }

            const result = await response.json();

            if (result?.status === 'accepted') {
                setAreFriends(true);
            } else {
                setAreFriends(false);
            }
            setFriendRequest(result);

            return result;
        } catch (error) {
            console.error('Error sending friend request:', error.message);
            throw error;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 유저 데이터 가져오기
                const userResponse = await fetch(`http://localhost:3000/api/users/${userId}`, {
                    method: 'GET',
                    credentials: 'include',
                });
    
                // 유저 데이터를 불러올 수 있는지 확인
                if (!userResponse.ok) throw new Error('User not found');
                const userData = await userResponse.json();
                console.log('Fetched user data:', userData); // 디버깅: 사용자 데이터 확인
                setUser(userData.data);
                
    
                // 현재 로그인한 사용자 정보 가져오기
                const currentUserResponse = await fetch(`http://localhost:3000/api/auth/user`, {
                    method: 'GET',
                    credentials: 'include',
                });
    
                // 현재 로그인한 사용자 정보를 불러올 수 있는지 확인
                if (!currentUserResponse.ok) throw new Error('Error fetching current user');
                const currentUserData = await currentUserResponse.json();
                console.log('Fetched current user:', currentUserData); // 디버깅: 로그인한 사용자 정보 확인
                setCurrentUser(currentUserData.user);
    
                // 사용자의 게시물 가져오기
                const postsResponse = await fetch(`http://localhost:3000/api/posts/user/${userId}`, {
                    method: 'GET',
                    credentials: 'include',
                });
    
                // 게시물 데이터를 불러올 수 있는지 확인
                if (!postsResponse.ok) throw new Error('Error fetching posts');
                const postsData = await postsResponse.json();
                console.log('Fetched posts data:', postsData); // 디버깅: 게시물 데이터 확인
    
                const filteredPosts = postsData.filter(post => {
                    console.log('Checking post:', post); // 디버깅: 각 포스트 확인
                    if (post.isGroupPost) {
                        console.log('Post is a group post. Group ID:', post.groupId);
    
                        // 그룹 포스트일 때 groupId와 members 필드, 그리고 currentUser 정보 확인
                        if (post.groupId && post.groupId.members && currentUser && currentUser.id) {
                            const isInGroup = post.groupId.members.includes(currentUser.id);
                            console.log(`Is current user in this group? ${isInGroup}`); // 디버깅: 그룹 여부 확인
                            return isInGroup;
                        }
                        console.log('Group ID or members are missing, skipping post.');
                        return false;
                    } else {
                        console.log(`Post is not a group post. Private: ${post.private}, Are friends: ${areFriends}`);
                        return post.private ? areFriends : true;
                    }
                });
    
                console.log('Filtered posts:', filteredPosts); // 디버깅: 필터링된 포스트 확인
                setPosts(filteredPosts);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error); // 디버깅: 에러 메시지 출력
                setLoading(false); 
            }
        };
    
        fetchData();
    }, [userId, areFriends, currentUser]);
    

    useEffect(() => {
        if (currentUser) {
            fetchFriendRequest();
        }
    }, [currentUser]);



    if (loading) return <div>Loading user details...</div>; 

    if (!user) return <div>User not found</div>; 

    return (
        <div>
            <div className="mainContent">
                <div className="userProfileContainer">
                    <span className="profileImgContainer">
                    <img src={user.avatar || '/Images/default-avatar.png'} alt="User Avatar" className="profileImg"/>

                    </span>
                    <span className="userName">
                        {user.firstName} {user.lastName}
                    </span>
                    {currentUser && (
                        currentUser.id === userId ? (
                            // user is viewing their own profile
                            <></>
                        ) : (
                            areFriends ? (
                                    <UnfriendAction
                                        request={friendRequest}
                                        fetchFriendRequest={fetchFriendRequest}
                                    />
                                )
                                :
                                (
                                    // users are not friends: handle pending and new friend request
                                    friendRequest ? (
                                        friendRequest.fromId === currentUser.id ? (
                                            <CancelRequestAction
                                                request={friendRequest}
                                                fetchFriendRequest={fetchFriendRequest}
                                            />
                                        ) : (
                                            <FriendRequestActions
                                                currentUser={currentUser}
                                                userId={userId}
                                                request={friendRequest}
                                                fetchFriendRequest={fetchFriendRequest}
                                            />
                                            )
                                    ) : (
                                        <CreateFriendRequest
                                            currentUser={currentUser}
                                            userId={userId}
                                            fetchFriendRequest={fetchFriendRequest}
                                        />
                                        )
                                )
                        ))}
                </div>
            </div>
            <hr className="solid"></hr>

            <div className="newFeedContent">
                <ListOfPosts posts={posts} user={currentUser} onPostEdit={() => {
                }} onPostDelete={() => {
                }}/>
            </div>
        </div>
    );
}
