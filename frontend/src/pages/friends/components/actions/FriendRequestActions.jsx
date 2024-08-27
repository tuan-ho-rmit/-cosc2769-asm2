import {pushError, pushSuccess} from "../../../../components/Toast/index.jsx";
// import {useEffect, useState} from "react";

export default function FriendRequestActions({userId, currentUser, fetchFriendRequest, request}) {
    // const [request, setRequest] = useState(null)
    //
    // const fetchFriendRequest = async () => {
    //     try {
    //         const response = await fetch(`http://localhost:3000/api/friendrequest/single/${currentUser.id}/${userId}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             credentials: 'include',
    //         }); // throw error
    //
    //         if (!response.ok) {
    //             const errorText = await response.text();
    //             throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    //         }
    //
    //         const result = await response.json();
    //         setRequest(result)
    //         return result; // Return result to handle it in the component
    //     } catch (error) {
    //         console.error('Error sending friend request:', error.message);
    //         throw error; // Rethrow error to handle it in the component
    //     }
    // }
    //
    // useEffect(() => {
    //     fetchFriendRequest()
    //     console.log('log request', request)
    //
    // }, [currentUser.id, userId]);

    // Condition to check if the profile belongs to the current user || the current's request different from user
    if (currentUser.id === userId) {
        return null; // disable these button when on your profile
    }

    // function to accept a friend request
    const acceptFriendRequest = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/friendrequest/${request._id}/accept`, {
                method: 'PATCH',
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
            const result = await response.json();
            pushSuccess("accept Friend successfully");
            return result;
        } catch (error) {
            console.error('Error accepting friend request:', error.message);
            pushError(error.message);
            throw error;
        }
    };

// function to reject a friend request
    const rejectFriendRequest = async () => {
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



    // if (request.toId === userId) {
    //
    // }

    return (
        <>
            <div>
                <button
                    onClick={acceptFriendRequest}
                    className="mt-2 px-4 py-2 bg-green-400 text-white rounded-md cursor-pointer"
                >
                    Confirm
                </button>
                <button
                    onClick={rejectFriendRequest}
                    className="mt-2 px-4 py-2 bg-red-400 text-white rounded-md cursor-pointer"
                >
                Cancel
                </button>
            </div>
        </>
    )
}