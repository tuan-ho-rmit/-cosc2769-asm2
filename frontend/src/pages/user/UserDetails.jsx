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
            console.log('Fetch friend request:', result);

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

    const fetchUserGroups = async () => {
        try {
            // Fetch the groups the current user has joined
            const response = await fetch(`http://localhost:3000/api/users/${currentUser.id}/groups`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Error fetching user groups');
            }

            const data = await response.json();
            setUserGroups(data.groups); // 그룹 목록 저장
        } catch (error) {
            console.error('Error fetching user groups:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user data
                const userResponse = await fetch(`http://localhost:3000/api/users/${userId}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!userResponse.ok) {
                    throw new Error('User not found');
                }

                const userData = await userResponse.json();
                setUser(userData.data);

                // Fetch current user
                const currentUserResponse = await fetch(`http://localhost:3000/api/auth/user`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!currentUserResponse.ok) {
                    throw new Error('Error fetching current user');
                }

                const currentUserData = await currentUserResponse.json();
                setCurrentUser(currentUserData.user);

                // Fetch user posts
                const postsResponse = await fetch(`http://localhost:3000/api/posts/user/${userId}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!postsResponse.ok) {
                    throw new Error('Error fetching posts');
                }

                const postsData = await postsResponse.json();

                // Filter posts based on privacy settings, friendship status, and group membership
                const filteredPosts = postsData.filter(post => {
                    if (post.isGroupPost) {
                        // 그룹 게시물일 경우 해당 그룹에 사용자가 가입했는지 확인
                        return userGroups.includes(post.groupId);
                    } else {
                        // 비공개 게시물은 친구일 경우 포함
                        return post.private ? areFriends : true;
                    }
                });

                setPosts(filteredPosts);
                setLoading(false); // 데이터 로드 완료 후 로딩 상태 변경
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false); // 에러 발생 시 로딩 상태 변경
            }
        };

        if (currentUser) {
            fetchUserGroups(); // 현재 유저가 가입한 그룹 목록을 먼저 불러옴
        }

        fetchData();
    }, [userId, areFriends, currentUser, userGroups]); // 의존성 추가: 그룹 목록과 친구 상태가 변경될 때마다 데이터 새로 불러오기

    useEffect(() => {
        if (currentUser) {
            fetchFriendRequest();
        }
    }, [currentUser]);

    if (loading) return <div>Loading user details...</div>; // 로딩 상태 체크

    if (!user) return <div>User not found</div>; // 유저 정보가 없는 경우 메시지 출력

    return (
        <div>
            <div className="mainContent">
                <div className="userProfileContainer">
                    <span className="profileImgContainer">
                        <img src={user.avatar || '/Images/default-avatar.png'} alt="User Avatar"
                             className="profileImg"/>
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
