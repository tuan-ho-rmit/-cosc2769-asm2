import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Tooltip from "../../../../components/tooltip";
import PopUp from "../../../../components/popup";
import { usePopUp } from "../../../../components/popup/usePopUp";

export default function UserItem({
    user,
    handleInactiveCofirm,
    handleActiveConfirm
}) {
    const popUpActivate = usePopUp();
    const userStatus = userStatuses.find((item) => item.Value === user.status);

    const onChangeStatus = () => {
        popUpActivate.onClose();
        if (userStatus.Value === "active") {
            return handleInactiveCofirm(user._id);
        } else {
            return handleActiveConfirm(user._id);
        }
    };

    return (
        <div className="card mb-3 p-4 border rounded-md shadow-md" >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex flex-col md:flex-row items-start md:items-center">
                    {/* <Link
                        to={`/profile/${user._id}`}
                        className="flex items-end text-decoration-none mb-2 md:mb-0"
                    > */}
                    <h5 className="text-lg font-semibold cursor-pointer hover:text-primary">
                        {user.username}
                    </h5>
                    {/* </Link> */}
                    <div className="ml-0 md:ml-3">
                        <UserStatusBox status={user.status} />
                    </div>
                </div>
                {user.role !== 'admin' && (
                    <div className="flex mt-2 md:mt-0">
                        <div className="mr-2">
                            <div className="flex gap-2 items-center">
                                <UserStatusDot status={user.status} />
                                <Tooltip text={userStatus.Value === "active" ? "Deactivate" : "Activate"}>
                                    <label class="relative inline-flex cursor-pointer items-center" onClick={() => popUpActivate.setTrue()}>
                                        <input id="switch" type="checkbox" class="peer sr-only" checked={userStatus.Value === "active"} />
                                        <label for="switch" class="hidden"></label>
                                        <div class="peer h-6 w-11 rounded-full border bg-slate-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-grey-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-primary"></div>
                                    </label>
                                </Tooltip>
                                <PopUp
                                    {...popUpActivate}
                                    onConfirm={onChangeStatus}
                                    title="Change User Status Confirmation"
                                    desc={`Are you sure you want to ${userStatus.Value === "active" ? "deactivate" : "activate"} the user ${user.username}?`}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <hr className="my-4" />
            <div className="flex flex-col md:flex-row">
                <p className="text-sm text-grey-200 mb-1 md:mb-0" >
                    <strong>Email: {user.email}</strong>
                </p>
                <p className="text-sm text-grey-200 mb-1 md:mb-0 ml-0 md:ml-3" >
                    <strong>Role: {getUserRoleName(user.role)}</strong>
                </p>
            </div>
            <div className="flex flex-col md:flex-row">
                <p className="text-sm text-grey-200 mb-1 md:mb-0" >
                    <small>Created At: {user.createdAt}</small>
                </p>
                <p className="text-sm text-grey-200 mb-0 ml-0 md:ml-3" >
                    <small>Updated At: {user.updatedAt}</small>
                </p>
            </div>
        </div >
    );
};

UserItem.propTypes = {
    user: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        updatedAt: PropTypes.string.isRequired,
    }).isRequired,
    handleLockConfirm: PropTypes.func.isRequired,
    handleUnLockConfirm: PropTypes.func.isRequired,
    handleInactiveCofirm: PropTypes.func.isRequired,
    handleActiveConfirm: PropTypes.func.isRequired,
};

export const userStatuses = [
    {
        Id: 1,
        Value: "active",
        Name: "Active",
        bgColor: '#E5F5ED',
        color: '#009D4F',
    },
    {
        Id: 2,
        Value: "inactive",
        Name: "Inactive",
        bgColor: '#FFF8E5',
        color: '#FFB600',
    },
];

export const userRoles = [
    { Id: 1, Value: "user", Name: "User" },
    { Id: 2, Value: "admin", Name: "Admin" },
];

export const UserStatusBox = ({ status }) => {
    const userStatus = userStatuses.find((item) => item.Value === status);

    return (
        <div className={`px-2 py-1 rounded-md`} style={{ backgroundColor: userStatus?.bgColor }}>
            <p className={`text-sm`} style={{ color: userStatus?.color, margin: 0 }}>{userStatus?.Name}</p>
        </div>
    );
};

const getUserRoleName = (role) => {
    const userRole = userRoles.find((item) => item.Value === role);
    return userRole ? userRole.Name : "";
};

UserStatusBox.propTypes = {
    status: PropTypes.string.isRequired,
};

const UserStatusDot = ({ status }) => {
    const userStatus = userStatuses.find((item) => item.Value === status);

    return (
        <div className="flex items-center space-x-2">
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: userStatus?.color }}></div>
        </div>
    );
};

UserStatusDot.propTypes = {
    status: PropTypes.string.isRequired,
};
