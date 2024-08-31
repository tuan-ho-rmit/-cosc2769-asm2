import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import ListOfPosts from '../post/components/ListOfPosts'; // ListOfPosts 컴포넌트 임포트
import './UserDetails.css';
import CreateFriendRequest from "../friends/components/friendrequest/CreateFriendRequest.jsx";
import FriendRequestActions from "../friends/components/actions/FriendRequestActions.jsx";
import UnfriendAction from "../friends/components/actions/UnfriendAction.jsx";
import CancelRequestAction from "../friends/components/actions/CancelRequestAction.jsx";


export default function UserDetails() {
    const {userId} = useParams(); // URL에서 userId를 가져옵니다. Get user ID from the URL
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가. Add Loader state
    const [currentUser, setCurrentUser] = useState(null); // 현재 로그인한 사용자 상태 추가. Add current logged-in user state
    const [friendRequest, setFriendRequest] = useState()
    const [areFriends, setAreFriends] = useState(false)


    const fetchFriendRequest = async () => {
        try {
            // fetch friend request from currentUser to userId
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
            console.log('Fetch friend request:', result)
            // set friendship status on the request status

            if (result?.status === 'accepted') {
                console.log('are already friends')
                setAreFriends(true)
            } else {
                console.log('are not friends')
                setAreFriends(false)
            }
            setFriendRequest(result)

            return result
        } catch (error) {
            console.error('Error sending friend request:', error.message);
            throw error; // Rethrow error to handle it in the component
        }
    }


    useEffect(() => {
        console.log('Requested userId:', userId); // URL에서 가져온 userId가 올바른지 확인

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

                // Fetch user posts
                const postsResponse = await fetch(`http://localhost:3000/api/posts/user/${userId}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!postsResponse.ok) {
                    throw new Error('Error fetching posts');
                }

                const postsData = await postsResponse.json();
                setPosts(postsData);

                setLoading(false); // Set loading to false after data is fetched

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
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false); // Set loading to false in case of error
            }
        }

        fetchData()


        // // 유저 정보를 가져옵니다.
        // fetch(`http://localhost:3000/api/users/${userId}`, {
        //     method: 'GET',
        //     credentials: 'include',
        // })
        //     .then(response => {
        //         console.log('Response status:', response.status); // 응답 상태 코드 확인
        //         if (!response.ok) {
        //             throw new Error('User not found');
        //         }
        //         return response.json();
        //     })
        //     .then(data => {
        //         console.log('Fetched user data:', data); // 가져온 데이터 출력
        //         setUser(data.data);
        //     })
        //     .catch(error => {
        //         console.error('Error fetching user details:', error);
        //         setLoading(false); // 에러 발생 시 로딩 상태 해제
        //     });
        //
        // // 해당 유저가 작성한 포스트를 가져옵니다.
        // fetch(`http://localhost:3000/api/posts/user/${userId}`, {
        //     method: 'GET',
        //     credentials: 'include',
        // })
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log('Fetched user posts:', data); // 가져온 게시물 데이터 출력
        //         setPosts(data);
        //         setLoading(false); // 로딩 상태 해제
        //     })
        //     .catch(error => {
        //         console.error('Error fetching user posts:', error);
        //         setLoading(false); // 에러 발생 시 로딩 상태 해제
        //     });
        //
        // // 현재 로그인한 사용자 정보를 가져옵니다. // Fetch the current logged-in user's information.
        // fetch(`http://localhost:3000/api/auth/user`, {
        //     method: 'GET',
        //     credentials: 'include',
        // })
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log('Fetched current user', data.user)
        //         setCurrentUser(data.user)
        //     })
        //     .catch(error => console.error('Error fetching current user:', error));

        // if (currentUser && userId) {
        //     fetchFriendRequest();
        // }



        // const intervalId = setInterval(() => {
        //     fetchFriendRequest();
        //     console.log('after 5 seconds:')
        // }, 5000);
        // return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        fetchFriendRequest();
    }, [currentUser]);

    if (loading) return <div>Loading user details...</div>; // 로딩 상태 체크

    if (!user) return <div>User not found</div>; // 유저 정보가 없는 경우 메시지 추가

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
                                            // display cancel request button if the fq is sent
                                            <CancelRequestAction
                                            request={friendRequest}
                                            fetchFriendRequest={fetchFriendRequest}
                                            />
                                        ) : (
                                            // display approve rq button
                                            <FriendRequestActions
                                                currentUser={currentUser}
                                                userId={userId}
                                                request={friendRequest}
                                                fetchFriendRequest={fetchFriendRequest}
                                            />
                                            )
                                    ) : (
                                    // display send fr rq button
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