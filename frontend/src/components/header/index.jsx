import React, { useContext, useEffect, useState } from 'react';
import { NotificationsContext } from '../right-side-bar/NotificationsContext';

export default function Header() {
  const [user, setUser] = useState(null);
  const { notifications, setOpen, open } = useContext(NotificationsContext);
  const unreadCount = notifications.filter((notification) => notification.status === 'unread').length;

  // Fetch user details from localStorage if user exists
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleAvatarClick = () => {
    if (user) {
      window.location.href = '/mydetail';
    }
  };

  return (
    <>
      <div className='bg-grey text-center h-[50px] border-b-1 border-white flex flex-row items-center'>
        <div className='basis-1/3 justify-start'>
          <svg className="h-[30px] w-[30px] text-white mx-8" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        </div>
        {/* <div className='basis-1/3'>
          <form className='flex flex-nowrap justify-center'>
            <div>
              <input type='text' placeholder='Search..' name='search'
                     className="bg-black block w-[200px] h-[30px] rounded-md border-0 py-1.5 pl-7 pr-20 text-white
                     ring-inset ring-white placeholder:text-yellow placeholder:text-center text-center focus:ring-1 focus:ring-inset focus:ring-indigo-600
                     sm:text-title text-title sm:leading-6"/>
            </div>
            <div className='ml-4 content-center self-center'>
              <button type="submit">
                <svg className="h-[25px] w-[25px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            </div>
          </form>
        </div> */}
        {user && (
          <div className='basis-2/3 flex flex-nowrap justify-end mr-4' style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
            <div className="relative" style={{ marginRight: '16px', cursor: 'pointer' }} onClick={() => setOpen(!open)}>
              <svg class= "size-8" className="h-[32px] w-[32px] text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg> 

              {unreadCount > 0 && (
                <span class=" absolute top-0 left-5 bg-lightDanger text-danger text-[12px] font-medium px-1.5 py-0.4 rounded">
                  {unreadCount}
                </span>
              )}
            </div>

            <div className='mx-4' >
              <img
                src={user.avatar || '/Images/example2.png'}  // use session user avatar
                className='w-8 h-8 ring-yellow ring-2 rounded-full cursor-pointer'
                alt='User Avatar'
                onClick={handleAvatarClick}
              />
            </div>
            <p className='text-white'>
              {user.firstName} {user.lastName}  {/* display session user name */}
            </p>
          </div>
        )}
      </div >
    </>
  );
}
