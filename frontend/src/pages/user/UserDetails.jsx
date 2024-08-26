import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ListOfPosts from '../post/components/ListOfPosts'; // ListOfPosts 컴포넌트 임포트
import './UserDetails.css';
import CreateFriendRequest from "../friends/components/friendrequest/CreateFriendRequest.jsx";

export default function UserDetails() {
    const {userId} = useParams(); // URL에서 userId를 가져옵니다. Get user ID from the URL
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가. Add Loader state
    const [currentUser, setCurrentUser] = useState(null); // 현재 로그인한 사용자 상태 추가. Add current logged-in user state

    useEffect(() => {
        console.log('Requested userId:', userId); // URL에서 가져온 userId가 올바른지 확인

        // 유저 정보를 가져옵니다.
        fetch(`http://localhost:3000/api/users/${userId}`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(response => {
                console.log('Response status:', response.status); // 응답 상태 코드 확인
                if (!response.ok) {
                    throw new Error('User not found');
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched user data:', data); // 가져온 데이터 출력
                setUser(data.data);
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
                setLoading(false); // 에러 발생 시 로딩 상태 해제
            });

        // 해당 유저가 작성한 포스트를 가져옵니다.
        fetch(`http://localhost:3000/api/posts/user/${userId}`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                console.log('Fetched user posts:', data); // 가져온 게시물 데이터 출력
                setPosts(data);
                setLoading(false); // 로딩 상태 해제
            })
            .catch(error => {
                console.error('Error fetching user posts:', error);
                setLoading(false); // 에러 발생 시 로딩 상태 해제
            });

        // 현재 로그인한 사용자 정보를 가져옵니다. // Fetch the current logged-in user's information.
        fetch(`http://localhost:3000/api/auth/user`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                console.log('Fetched current user', data.user) // THIS RETURN UNDEFINED ugly cri
                setCurrentUser(data.user)
            })
            .catch(error => console.error('Error fetching current user:', error));
    }, [userId]);

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
                        <CreateFriendRequest
                            currentUser = {currentUser}
                            userId = {userId}
                            user = {user}
                        />
                    )}

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
