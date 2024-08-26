import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

export default function FriendList() {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true)
    const {userId} = useParams();

    useEffect(async () => {
        try {
            const response = await fetch('http://localhost:3000/api/friendrequest/friendslist/',
                {
                    method: 'GET',
                    credentials: 'include'
                })
            if (!response.ok) {
                throw new Error('failed to fetch friends')
            }
            const data = await response.json();
            setFriends(data);
        } catch (error) {
            console.log('error fetching friendlist', error)
        } finally {
            setLoading(false)
        }
    }, [userId])

    if (loading) return <p>Loading...</p>


    return(
        <>
            <div>
                <h1>
                    Friend List
                </h1>
            </div>
            <div>
                <ul>
                    {friends.map(friend => (
                        <li key={friend.id}>
                            <span>{friend.firstName} {friend.lastName}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}