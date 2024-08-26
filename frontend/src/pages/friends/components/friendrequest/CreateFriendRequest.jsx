export default function CreateFriendRequest({currentUser, userId, user}) {
    const sendFriendRequest = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/friendrequest/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fromId: currentUser._id,
                    toId: userId,
                    status: 'pending'
                }),
                credentials: 'include',
            });

            console.log(currentUser)
            console.log(userId)
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
            }

            const result = await response.json();
            return result; // Return result to handle it in the component
        } catch (error) {
            console.error('Error sending friend request:', error.message);
            throw error; // Rethrow error to handle it in the component
        }
    }
        return (
            <button onClick={sendFriendRequest}
                    className="mt-4 px-4 py-2 bg-yellow-400 text-gray-800 rounded-md cursor-pointer"
            >
                Send Friend Request
            </button>
        );
}
