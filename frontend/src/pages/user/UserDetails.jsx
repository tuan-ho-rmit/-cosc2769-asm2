import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ListOfPosts from '../post/components/ListOfPosts'; // Import the ListOfPosts component
import './UserDetails.css';
import CreateFriendRequest from "../friends/components/friendrequest/CreateFriendRequest.jsx"; 
import FriendRequestActions from "../friends/components/actions/FriendRequestActions.jsx";
import UnfriendAction from "../friends/components/actions/UnfriendAction.jsx";
import CancelRequestAction from "../friends/components/actions/CancelRequestAction.jsx";

// UserDetails component fetches and displays user details, posts, and handles friend requests.
export default function UserDetails() {
    const { userId } = useParams(); // Retrieves the userId from the URL
    const [user, setUser] = useState(null); // State to store user details
    const [posts, setPosts] = useState([]); // State to store posts of the user
    const [loading, setLoading] = useState(true); // State to manage loading status
    const [currentUser, setCurrentUser] = useState(null); // State to store the current logged-in user's details
    const [friendRequest, setFriendRequest] = useState(); // State to store friend request status
    const [areFriends, setAreFriends] = useState(false); // State to check if the current user and profile user are friends
    const [userGroups, setUserGroups] = useState([]); // State to store groups the user has joined

    // Function to fetch friend request details between the current user and the profile user
    const fetchFriendRequest = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/friendrequest/single/${currentUser.id}/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Includes credentials like cookies
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
            }

            const result = await response.json();

            // If the request is accepted, set areFriends to true
            if (result?.status === 'accepted') {
                setAreFriends(true);
            } else {
                setAreFriends(false);
            }
            setFriendRequest(result); // Store the friend request status

            return result;
        } catch (error) {
            console.error('Error sending friend request:', error.message);
            throw error;
        }
    };

    // Fetch user data, posts, and current logged-in user details
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user details by userId
                const userResponse = await fetch(`http://localhost:3000/api/users/${userId}`, {
                    method: 'GET',
                    credentials: 'include',
                });
    
                if (!userResponse.ok) throw new Error('User not found');
                const userData = await userResponse.json();
                console.log('Fetched user data:', userData); // Debug: Log fetched user data
                setUser(userData.data);
                
    
                // Fetch the current logged-in user details
                const currentUserResponse = await fetch(`http://localhost:3000/api/auth/user`, {
                    method: 'GET',
                    credentials: 'include',
                });
    
                if (!currentUserResponse.ok) throw new Error('Error fetching current user');
                const currentUserData = await currentUserResponse.json();
                console.log('Fetched current user:', currentUserData); // Debug: Log current user info
                setCurrentUser(currentUserData.user);
    
                // Fetch posts made by the profile user
                const postsResponse = await fetch(`http://localhost:3000/api/posts/user/${userId}`, {
                    method: 'GET',
                    credentials: 'include',
                });
    
                if (!postsResponse.ok) throw new Error('Error fetching posts');
                const postsData = await postsResponse.json();
                console.log('Fetched posts data:', postsData); // Debug: Log posts data
    
                // Filter posts based on privacy and group membership
                const filteredPosts = postsData.filter(post => {
                    console.log('Checking post:', post); // Debug: Log each post
                    if (post.isGroupPost) {
                        console.log('Post is a group post. Group ID:', post.groupId);
    
                        // Check if the current user is in the same group as the profile user
                        if (post.groupId && post.groupId.members && currentUser && currentUser.id) {
                            const isInGroup = post.groupId.members.includes(currentUser.id);
                            console.log(`Is current user in this group? ${isInGroup}`); // Debug: Check group membership
                            return isInGroup;
                        }
                        console.log('Group ID or members are missing, skipping post.');
                        return false;
                    } else {
                        // Check if the post is private and if they are friends
                        console.log(`Post is not a group post. Private: ${post.private}, Are friends: ${areFriends}`);
                        return post.private ? areFriends : true;
                    }
                });
    
                console.log('Filtered posts:', filteredPosts); // Debug: Log filtered posts
                setPosts(filteredPosts);
                setLoading(false); // Set loading to false once data is fetched
            } catch (error) {
                console.error('Error fetching data:', error); // Debug: Log error
                setLoading(false); 
            }
        };
    
        fetchData(); // Call fetch data function
    }, [userId, areFriends, currentUser]); // Effect depends on userId, areFriends, and currentUser
    

    // Fetch friend request after currentUser is loaded
    useEffect(() => {
        if (currentUser) {
            fetchFriendRequest();
        }
    }, [currentUser]);



    if (loading) return <div>Loading user details...</div>; // Display loading message while fetching

    if (!user) return <div>User not found</div>; // Display if the user is not found

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
                            // If the current user is viewing their own profile, no friend action is shown
                            <></>
                        ) : (
                            // Handle friend status or friend request actions based on the status
                            areFriends ? (
                                    <UnfriendAction
                                        request={friendRequest}
                                        fetchFriendRequest={fetchFriendRequest}
                                    />
                                )
                                :
                                (
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
                {/* Render ListOfPosts with the fetched posts */}
                <ListOfPosts posts={posts} user={currentUser} onPostEdit={() => {
                }} onPostDelete={() => {
                }}/>
            </div>
        </div>
    );
}
