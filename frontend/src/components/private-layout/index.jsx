import React from 'react';
import Header from '../header';
import LeftSideBar from '../left-side-bar';
import { Outlet } from 'react-router-dom';

export default function PrivateLayout() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Header />

            <div style={{ display: 'flex', flexDirection: 'row', width:'100%', overflow: 'hidden', minHeight: 'calc(100vh - 64px)' }}>
                {/*<LeftSideBar />*/}
                <div style={{ flex: 1, overflow: 'auto' }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
