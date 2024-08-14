import React from 'react'

export default function RightSideBar() {
    const notifications = [
        {id: 1, type: 'friend_request', content: 'Mike sent you a friend request', read:false},
        {id: 2, type: 'reaction', content: 'Mike reacted to your post', read:false},
        {id: 3, type: 'group_invite', content: 'You were invited to Group "Full Stack Development Group"', read:true},
    ]


    return (
        <>
            <div className='conent-end bg-black h-[100vh] w-[250px] right-0 absolute border-white border-l-1'>
                <nav>
                    <ul>
                        {notifications.map((notification, i) => (
                            <li key={notification.id} className={`p-2 border-b border-white ${notification.read ? 'bg-black text-white' : 'bg-yellow'}`}>
                                {notification.content}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    )
}
