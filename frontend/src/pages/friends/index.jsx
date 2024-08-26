import NavigationBar from "./components/NavigationBar.jsx";
import {Outlet} from "react-router-dom";

export default function Friends() {
    return (
        <>
            <NavigationBar/>
            <Outlet />
        </>
    )
}