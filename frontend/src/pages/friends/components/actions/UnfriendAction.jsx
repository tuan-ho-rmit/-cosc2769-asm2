import {pushError, pushSuccess} from "../../../../components/Toast/index.jsx";
import Button from "../../../../components/button/index.jsx";

export default function UnfriendAction ({request, fetchFriendRequest}) {
    // unfriend function
    const unfriend = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/friendrequest/${request._id}/unfriend`, {
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
            pushSuccess("Unfriended successfully");
        } catch (error) {
            console.error('Error unfriending:', error.message);
            pushError(error.message);
            throw error;
        }
    };
    return (
        <Button onClick={unfriend}
        variant='danger'
        size='md'
        ripple='true'>
            Unfriend
        </Button>
    )
}