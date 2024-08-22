import React from 'react'
import NavigationBar from './components/NavigationBar'
import { Outlet } from 'react-router-dom'

export default function Admin() {
    return (
        <div>
            <NavigationBar />
            <Outlet />
        </div>
    )
}
