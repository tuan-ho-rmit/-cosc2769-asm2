import React, { useEffect } from 'react'
import NavigationBar from './components/NavigationBar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../provider/AuthProvider'

export default function Admin() {
    const { user } = useAuth()
    const navigate = useNavigate()
    useEffect(() => {
        if (user.role != "admin") {
            navigate('/')
        }

    }, [user])  

    return (
        <div>
            <NavigationBar />
            <Outlet />
        </div>
    )
}
