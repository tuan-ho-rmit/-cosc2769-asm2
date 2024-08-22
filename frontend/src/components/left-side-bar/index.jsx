import React from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

export default function LeftSideBar() {
    const navigate = useNavigate();

    const handleLogOut = async () => {
        try {
            // 서버로 로그아웃 요청
            await axios.post('http://localhost:3000/api/auth/logout', {}, { withCredentials: true });

            // 클라이언트 세션 제거
            localStorage.removeItem('user');

            // 로그인 페이지로 리디렉션
            navigate('/login');
            window.location.reload(); // Force refresh to ensure session state is cleared
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
      <>
        <div className='w-[250px] bg-black relative left-0 text-white text-subheader border-white border-r-1  h-[100vh]'>
            <nav className='block text-white'>
                <ul className='grid grid-cols-1 divide-y divide-white/20'>
                    <li className='flex h-[40px] items-center justify-center'>
                        <NavLink to='/' className='inline-flex justify-center hover:bg-grey w-[100%] h-[100%]'>
                            <div className='items-center justify-center inline-flex'>
                                <svg className="h-[20px] w-[20px] text-white" viewBox="0 0 24 24" fill="none"
                                     stroke="currentColor"
                                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                    <polyline points="9 22 9 12 15 12 15 22"/>
                                </svg>
                                <span className='mx-7'>
                                    Feed
                                </span>
                            </div>
                        </NavLink>
                    </li>
                    <li className='flex h-[40px] items-center justify-center'>
                        <NavLink to='/groups'
                                 className='inline-flex justify-center hover:bg-grey w-[100%] h-[100%]'>
                            <div className='items-center justify-center inline-flex'>
                                <svg className="h-[20px] w-[20px] text-white" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                                <span className='mx-7'>
                                    Groups
                                </span>
                            </div>
                        </NavLink>
                    </li>
                    <li className='flex h-[40px] items-center justify-center'>
                        <NavLink to='/friends' className='inline-flex justify-center hover:bg-grey w-[100%] h-[100%]'>
                            <div className='items-center justify-center inline-flex'>
                                <svg className="h-[20px] w-[20px] text-white" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                                </svg>
                                <span className='mx-7'>
                                    Friends
                                </span>
                            </div>
                        </NavLink>
                    </li>
                    <li className='flex h-[40px] items-center justify-center'>
                        <NavLink to='/login' onClick={handleLogOut}
                                 className='inline-flex justify-center hover:bg-grey w-[100%] h-[100%]'>
                            <div className='items-center justify-center inline-flex'>
                                <svg className="h-[20px] w-[20px] text-white" width="24" height="24" viewBox="0 0 24 24"
                                     strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"
                                     strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z"/>
                                    <path
                                        d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"/>
                                    <path d="M7 12h14l-3 -3m0 6l3 -3"/>
                                </svg>
                                <span className='mx-7'>
                                    Log Out
                                </span>
                            </div>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
      </>
    );
}
