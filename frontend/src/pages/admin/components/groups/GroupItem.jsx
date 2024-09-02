import React from "react";
import PropTypes from "prop-types";
import Tooltip from "../../../../components/tooltip";
import PopUp from "../../../../components/popup";
import { usePopUp } from "../../../../components/popup/usePopUp";
import Button from "../../../../components/button";
import { Link } from "react-router-dom";

export default function GroupItem({
    group,
    handleApproveConfirm,
    handleRejectConfirm
}) {
    const popUpActivate = usePopUp();
    const popUpApprove = usePopUp();
    const popUpReject = usePopUp();
    const groupStatus = groupStatuses.find((item) => item.Value === group.status);

    const onChangeStatus = () => {
        popUpActivate.onClose();
        if (groupStatus.Value === "active") {
            return handleRejectConfirm(group._id);
        } else {
            return handleApproveConfirm(group._id);
        }
    };

    return (
        <div className="card mb-3 p-4 border rounded-md shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex flex-col md:flex-row items-start md:items-center">
                    <Link
                        to={`/groups/${group._id}`}
                        className="flex items-end text-decoration-none mb-2 md:mb-0"
                    >
                        <h5 className="text-lg font-semibold cursor-pointer hover:text-primary">
                            {group.groupName}
                        </h5>
                    </Link>
                    <div className="ml-0 md:ml-3">
                        <GroupStatusBox status={group.status} />
                    </div>
                </div>
                {group.status == 'pending' ?
                    <>
                        <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end", alignItems: "flex-end", width: "100%" }}>
                            <Tooltip text="Approve group request" position={"top"}>
                                <Button variant="outline-primary" size='sm' onClick={() => popUpApprove.setTrue()}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </Button>
                            </Tooltip>

                            <Tooltip text="Reject group request" position={"top"}>
                                <Button variant="outline-primary" size='sm' onClick={() => popUpReject.setTrue()}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </Button>
                            </Tooltip>
                        </div>
                        <PopUp
                            {...popUpApprove}
                            onConfirm={() => { handleApproveConfirm(group._id) }}
                            title="Approve group Confirmation"
                            desc={`Are you sure you want to approve this group?`}
                        />
                        <PopUp
                            {...popUpReject}
                            onConfirm={() => { handleRejectConfirm(group._id) }}
                            title="Reject group Confirmation"
                            desc={`Are you sure you want to reject this group?`}
                        />
                    </>
                    : (
                        <div className="flex mt-2 md:mt-0">
                            <div className="mr-2">
                                <div className="flex gap-2 items-center">
                                    <GroupStatusDot status={group.status} />
                                    <Tooltip text={groupStatus.Value === "active" ? "Deactivate" : "Activate"}>
                                        <label className="relative inline-flex cursor-pointer items-center" onClick={() => popUpActivate.setTrue()}>
                                            <input id="switch" type="checkbox" className="peer sr-only" checked={groupStatus.Value === "active"} />
                                            <label htmlFor="switch" className="hidden"></label>
                                            <div className="peer h-6 w-11 rounded-full border bg-slate-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-grey-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-primary"></div>
                                        </label>
                                    </Tooltip>
                                    <PopUp
                                        {...popUpActivate}
                                        onConfirm={onChangeStatus}
                                        title="Change Group Status Confirmation"
                                        desc={`Are you sure you want to ${groupStatus.Value === "active" ? "deactivate" : "activate"} the group ${group.name}?`}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
            </div>
            <hr className="my-4" />
            <div className="flex flex-col md:flex-row">
                <p className="text-sm text-grey-200 mb-1 md:mb-0">
                    <strong>Created by: {group.createdBy}</strong>
                </p>
                <p className="text-sm text-grey-200 mb-1 md:mb-0 ml-0 md:ml-3">
                    <strong>Members: {group.members.length}</strong>
                </p>
            </div>
            <div className="flex flex-col md:flex-row">
                <p className="text-sm text-grey-200 mb-1 md:mb-0">
                    <small>Created At: {group.createdAt}</small>
                </p>
                {/* <p className="text-sm text-grey-200 mb-0 ml-0 md:ml-3">
                    <small>Updated At: {group.updatedAt}</small>
                </p> */}
            </div>
        </div>
    );
};

GroupItem.propTypes = {
    group: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        membersCount: PropTypes.number.isRequired,
        createdAt: PropTypes.string.isRequired,
        updatedAt: PropTypes.string.isRequired,
    }).isRequired,
    handleDeactivateConfirm: PropTypes.func.isRequired,
    handleActivateConfirm: PropTypes.func.isRequired,
};

export const groupStatuses = [
    {
        Id: 1,
        Value: "pending",
        Name: "Pending",
        bgColor: '#EEEEEE',
        color: '#85858A',
    },
    {
        Id: 2,
        Value: "active",
        Name: "Active",
        bgColor: '#E5F5ED',
        color: '#009D4F',
    },
    {
        Id: 3,
        Value: "inactive",
        Name: "Inactive",
        bgColor: '#FFF8E5',
        color: '#FFB600',
    },
];

export const groupTypes = [
    { Id: 1, Value: "userGroup", Name: "User Group" },
    { Id: 2, Value: "adminGroup", Name: "Admin Group" },
];

export const GroupStatusBox = ({ status }) => {
    const groupStatus = groupStatuses.find((item) => item.Value === status);

    return (
        <div className={`px-2 py-1 rounded-md`} style={{ backgroundColor: groupStatus?.bgColor }}>
            <p className={`text-sm`} style={{ color: groupStatus?.color, margin: 0 }}>{groupStatus?.Name}</p>
        </div>
    );
};


GroupStatusBox.propTypes = {
    status: PropTypes.string.isRequired,
};

const GroupStatusDot = ({ status }) => {
    const groupStatus = groupStatuses.find((item) => item.Value === status);

    return (
        <div className="flex items-center space-x-2">
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: groupStatus?.color }}></div>
        </div>
    );
};

GroupStatusDot.propTypes = {
    status: PropTypes.string.isRequired,
};
