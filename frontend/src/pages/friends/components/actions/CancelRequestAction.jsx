import {pushError, pushSuccess} from "../../../../components/Toast/index.jsx";

export default function CancelRequestAction({request, fetchFriendRequest}) {
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
        <button onClick={deleteFriendRequest}>
            Cancel Friend Request
        </button>
    )
}