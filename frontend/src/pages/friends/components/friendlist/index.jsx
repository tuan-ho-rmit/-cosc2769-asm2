import {useEffect, useState} from "react";
import UnfriendAction from "../actions/UnfriendAction.jsx";

export default function FriendList() {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState(null)
    const [friendRequest, setFriendRequest] = useState()
    const [request, setRequest] = useState(null)

    const fetchCurrentUser = async () => {
        try {
            // Fetch current user
            const currentUserResponse = await fetch(`http://localhost:3000/api/auth/user`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!currentUserResponse.ok) {
                throw new Error('Error fetching current user');
            }

            const currentUserData = await currentUserResponse.json();
            console.log('fetched current User Data:', currentUserData)
            setCurrentUser(currentUserData.user);

            const currentData = currentUserData.user
            console.log('currentData:', currentData)

            const friendList = currentData.friendIds
            console.log('array of friends: ', friendList)

            console.log('testing first friend', friendList[0])
            console.log('testing first friends first name:', friendList[0].firstName)

            setFriends(friendList)
        }  catch (error) {
            console.error('Error fetching user\'s data:', error);
            setLoading(false); // Set loading to false in case of error66cb510c37a64403c990d993
        }
    }


    // fetch friend request
    const fetchFriendRequest = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/friendrequest/`, {
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

            const resultToUser = await response.json();
            console.log('Fetch friend request', resultToUser)
            setFriendRequest(resultToUser)




        } catch (error) {
            console.error('Error fetching friend request:', error.message);
            throw error; // Rethrow error to handle it in the component
        }
    }
    const handleFriendRequest = () => {
        if (currentUser && friendRequest) { // Check if both data exist
            if (currentUser.id === friendRequest.fromId || currentUser.id === friendRequest.toId) {
                console.log(friendRequest);
                setRequest(friendRequest);
            }
        }
    }

    useEffect(() => {
        // console.log('Requested userId:', userId)

        fetchCurrentUser()
        fetchFriendRequest()

        handleFriendRequest()

        setLoading(false)
    }, [])




    // useEffect(() => {
    //     const fetchFriendData = async () => {
    //         try {
    //             console.log(friendsArray)
    //             const friendDataPromises = friendsArray.map(async (friendId) => {
    //                 // fetch the friend's data
    //                 const friendUserResponse = await fetch(`http://localhost:3000/api/users/${friendId}`, {
    //                     method: 'GET',
    //                     credentials: 'include',
    //                 });
    //                 if (!friendDataResponse.ok) {
    //                     throw new Error(`Error fetching data for friend ${friendId}`);
    //                 }
    //
    //                 const friendData = await friendUserResponse.json();
    //                 console.log('friend data for: ', friendData);
    //                 return friendData
    //             })
    //
    //             // wait for all promises to resolve and update the state
    //             const friendData = await Promise.all(friendDataPromises)
    //             console.log('friend data: ', friendData)
    //             setFriends(friendData)
    //             setLoading(false)
    //
    //         } catch (error) {
    //             console.error('Error fetching friend\'s data:', error);
    //             setLoading(false); // Set loading to false in case of error
    //         }
    //     }
    //     if (friendsArray.length > 0) {
    //         fetchFriendData()
    //     }
    // }, [friendsArray]);

    if (loading) return <p>Loading...</p>

    if (friends.length === 0 && !loading) {
        return <p>You don't have any friends yet.</p>;
    }

    return(
        <>
            <div>
                <h1>
                    Your Friend List
                </h1>
            </div>
            <div>
                <ul>
                    {friends.map(friend => (
                        <li key={friend.id}>
                            <span>{friend} {friend.firstName} </span>
                            {/* TODO: resolve bug at displaying names*/}
                            <UnfriendAction // TODO: resolve bug at id not found
                                fetchFriendRequest={fetchFriendRequest}
                                request={request}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}