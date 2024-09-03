import {pushError, pushSuccess} from "../../../../components/Toast/index.jsx";
import Button from "../../../../components/button/index.jsx";

export default function CreateFriendRequest({currentUser, userId, fetchFriendRequest}) {
    const sendFriendRequest = async () => {
        try {
            // Prepare data to send
            const requestData = {
                fromId: currentUser.id, // The current user's ID
                toId: userId,           // The target user's ID
                status: 'pending'
            };

            const response = await fetch('http://localhost:3000/api/friendrequest/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
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

    // Condition to check if the profile belongs to the current user
    if (currentUser.id === userId) {
        return null; // disable the friend request button when on your profile
    }


    return (
        // !request || (request && request.status) === 'rejected' ?
        <Button onClick={sendFriendRequest}
                variant={'primary'}
                size={'md'}
                ripple={'true'}
                // className="mt-4 px-4 py-2 bg-yellow-400 text-gray-800 rounded-md cursor-pointer"
        >
            Send Friend Request
        </Button>
    );
}

