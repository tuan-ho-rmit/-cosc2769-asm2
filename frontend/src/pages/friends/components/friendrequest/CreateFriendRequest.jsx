import {pushError, pushSuccess} from "../../../../components/Toast/index.jsx";
import {useEffect, useState} from "react";

export default function CreateFriendRequest({currentUser, userId, user}) {
    console.log('current user:', currentUser)
    console.log(userId)
    console.log(user)
    const [request, setRequest] = useState()

    const fetchFriendRequest = async () => {
        try {
            console.log('buggy')
            const response = await fetch(`http://localhost:3000/api/friendrequest/single/${currentUser.id}/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }); // throw error

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
            }

            const result = await response.json();
            setRequest(result)
            return result; // Return result to handle it in the component
        } catch (error) {
            console.error('Error sending friend request:', error.message);
            throw error; // Rethrow error to handle it in the component
        }
    }
    const sendFriendRequest = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/friendrequest/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fromId: currentUser.id,
                    toId: userId,
                    status: 'pending'
                }),
                credentials: 'include',
            }); // throw error

            if (!response.ok) {
                const errorText = await response.text();
                pushError(errorText);
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
            }

            const result = await response.json();
            fetchFriendRequest()
            pushSuccess("Friend request sent successfully")
            return result; // Return result to handle it in the component
        } catch (error) {
            console.error('Error sending friend request:', error.message);
            throw error; // Rethrow error to handle it in the component
        }
    }
    useEffect(() => {
        fetchFriendRequest()
        console.log('log request', request)
    }, []);

    const deleteFriendRequest = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/friendrequest/${request._id}/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
            }

            fetchFriendRequest(); // Refresh the request state
            pushSuccess("Friend request deleted successfully");
        } catch (error) {
            console.error('Error deleting friend request:', error.message);
            pushError(error.message);
            throw error;
        }
    };


    return (
            !request || (request && request.status) === 'rejected' ?
            <button onClick={sendFriendRequest}
                    className="mt-4 px-4 py-2 bg-yellow-400 text-gray-800 rounded-md cursor-pointer"
            >
                Send Friend Request
            </button> : request && request.status === 'accepted' ?
                    <button>
                        Unfriend
                    </button>
                    :
                    <button onClick={deleteFriendRequest}>
                        Cancel
                    </button>
        );
}

