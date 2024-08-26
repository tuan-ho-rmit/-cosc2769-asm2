// function to accept a friend request
const acceptFriendRequest = async (requestId) => {
    try {
        const response = await fetch(`http://localhost:3000/api/friendrequest/${requestId}/accept`, {
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

        const result = await response.json();
        // console.log(result)
        return result;
    } catch (error) {
        console.error('Error accepting friend request:', error.message);
        throw error;
    }
};

// function to reject a friend request
const rejectFriendRequest = async (requestId) => {
    try {
        const response = await fetch(`http://localhost:3000/api/friendrequest/${requestId}/reject`, {
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

        const result = await response.json();
        console.log(result)
        return result;
    } catch (error) {
        console.error('Error rejecting friend request:', error.message);
        throw error;
    }
};

export default function FriendRequestActions({requestId}) {
    const handleAccept = async () => {
        try {
            const result = await acceptFriendRequest(requestId);
            console.log('Friend request accepted:', result)
        } catch (error) {
            console.error('error accepting friend rq', error.message);
        }
    }
    const handleReject = async () => {
        try {
            const result = await rejectFriendRequest(requestId);
            console.log('Friend request accepted:', result)
        } catch (error) {
            console.error('error accepting friend rq', error.message);
        }
    }
    return (
        <>
            <div>
                <button
                    onClick={handleAccept}
                    className="mt-2 px-4 py-2 bg-green-400 text-white rounded-md cursor-pointer"
                >
                    Accept
                </button>
                <button
                    onClick={handleReject}
                    className="mt-2 px-4 py-2 bg-red-400 text-white rounded-md cursor-pointer"
                >
                    Reject
                </button>
            </div>
        </>
    )
}