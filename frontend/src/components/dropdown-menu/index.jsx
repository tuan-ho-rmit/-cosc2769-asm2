import React from 'react';
import PropTypes from 'prop-types';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const DropdownMenu = ({ title, items, icon: Icon, position = 'bottom-right' }) => {

    const positionClasses = {
        'top-right': 'origin-top-right bottom-full right-0 mt-2',
        'bottom-left': 'origin-bottom-left top-full left-0 mt-2',
        'top-left': 'origin-top-left bottom-full left-0 mt-2',
        'bottom-right': 'origin-bottom-right top-full right-0 mt-2',
    };

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white text-black px-3 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    {title}
                    {Icon ? <Icon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-500" /> : <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-500" />}
                </MenuButton>
            </div>

            <MenuItems
                transition
                className={`absolute z-10 w-56 rounded-md bg-white text-black shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in ${positionClasses[position]}`}
            >
                <div className="py-1">
                    {items.map((item, index) => (
                        <MenuItem
                            key={index}
                            as="div"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer hover:bg-grey-400"
                            onClick={item.onClick}
                        >
                            {item.label}
                        </MenuItem>
                    ))}
                </div>
            </MenuItems>
        </Menu>
    );
};

DropdownMenu.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.elementType,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
            onClick: PropTypes.func,
        })
    ).isRequired,
    position: PropTypes.oneOf(['top-right', 'bottom-left', 'top-left', 'bottom-right']),
};

export default DropdownMenu;
