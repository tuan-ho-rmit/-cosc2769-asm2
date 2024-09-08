import {pushError, pushSuccess} from "../../../../components/Toast/index.jsx";
import Button from "../../../../components/button/index.jsx";

export default function FriendRequestActions({userId, currentUser, fetchFriendRequest, request}) {
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
            pushSuccess("Cancel friend request successfully");
        } catch (error) {
            console.error('Error deleting friend request:', error.message);
            pushError(error.message);
            throw error;
        }
    };

    return (
        <>
            <div style={{
                marginTop: "8px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: "16px"
            }}>
                <Button
                    onClick={acceptFriendRequest}
                    variant={'primary'}
                    size={'md'}
                    ripple={'true'}
                >
                    Confirm
                </Button>
                <Button
                    onClick={rejectFriendRequest}
                    variant={'outline-primary'}
                    size={'md'}
                    ripple={'true'}
                >
                    Cancel
                </Button>
            </div>
        </>
    )
}