import {NavLink} from "react-router-dom";
import Tooltip from '../../../components/tooltip'

const navBarItems = [
    {
        path: 'friendlist',
        title: 'Friend List',
        icon:
            <svg className="h-8 w-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
    },
    {
        path: 'friendrequest',
        title: 'Friend Request',
        icon:
            <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>

    }
]

export default function NavigationBar() {
    return (
        <>
            <nav className="bg-black border-b dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center items-center space-x-4">
                        {navBarItems.map((item, i) => (
                            <Tooltip text={item.title} position='bottom'>
                                <NavLink to={item.path}
                                         key={i}
                                         className={({isActive}) =>
                                isActive
                                    ? "flex items-center px-5 py-3 text-sm font-medium text-primary border-b-2 border-primary"
                                    : "flex items-center px-5 py-3 text-sm font-medium text-white"
                                }
                                         style={({isActive}) => {
                                             return {
                                                 color: isActive && "#FFD369"
                                             }
                                         }}
                                >
                                    {item.icon}
                                </NavLink>
                            </Tooltip>
                        ))}
                    </div>
                </div>
            </nav>
        </>
    )
}