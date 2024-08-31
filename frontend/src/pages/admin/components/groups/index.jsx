import React, { useCallback, useEffect, useRef, useState } from 'react';
import GroupItem, { groupStatuses } from './GroupItem'; // Assuming you have similar roles and statuses for groups
import BasePaginationList from '../../../../components/pagination/BasePaginationList';
import NoData from '../../../../components/pagination/NoData';
import WrapperFilter from '../../../../components/pagination/WrapperFilter';
import { baseUrl } from '../../../../config';
import { pushError, pushSuccess } from '../../../../components/Toast/index';
import debounce from '../../../../helper';
import TextField from '../../../../components/text-field/index';
import Autocomplete from '../../../../components/autocomplete/Autocomplete';
import { useCustomAutocomplete } from '../../../../components/autocomplete/useAutocomplete';

const groupSearchTypes = [
    {
        id: 1,
        name: "Group Name",
        value: "groupName",
    },
    {
        id: 2,
        name: "Created By",
        value: "createdBy",
    },
];

export default function AdminGroups() {
    const pageSize = 5;
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState({
        searchType: groupSearchTypes[0],
        page: 1,
        searchValue: "",
        status: undefined,
    });
    const [paging, setPaging] = useState({
        data: [],
        totalCount: 0,
        totalPages: 0,
    });

    const searchRef = useRef(null);
    const searchTypeRef = useRef(null);

    const handleResetFilter = () => {
        setFilter({ searchValue: "", searchType: groupSearchTypes[0], page: 1 });
        if (searchRef.current) {
            searchRef.current.value = "";
        }
    };

    const handleOnChangeSearch = useCallback(
        debounce((value) => {
            setFilter((prev) => ({ ...prev, searchValue: value, page: 1 }));
        }, 300),
        []
    );

    const handleApproveConfirm = async (groupId) => {
        try {
            const url = new URL(`${baseUrl}/api/groups/approve/${groupId}`);
            const response = await fetch(url, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                pushSuccess("Group is active");
                fetchGroups();
            } else {
                pushError("Failed to approve group request");
                throw new Error("Failed to approve group request");
            }
        } catch (error) {
            pushError("Failed to approve group request");
        }
    };

    const handleRejectConfirm = async (groupId) => {
        try {
            const url = new URL(`${baseUrl}/api/groups/reject/${groupId}`);
            const response = await fetch(url, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                pushSuccess("Group is inactive");
                fetchGroups();
            } else {
                pushError("Failed to reject group request");
                throw new Error("Failed to reject group request");
            }
        } catch (error) {
            pushError("Failed to reject group request");
        }
    };

    const fetchGroups = async () => {
        setLoading(true);
        const url = new URL(`${baseUrl}/api/groups/list`);
        url.searchParams.append("page", filter.page);
        url.searchParams.append("limit", pageSize);
        if (filter.status) {
            url.searchParams.append("status", filter.status.Value);
        }
        if (filter.role) {
            url.searchParams.append("role", filter.role.Value);
        }
        url.searchParams.append("search", filter.searchValue);
        url.searchParams.append("searchType", filter.searchType);

        return fetch(url, {
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    pushError("Failed to get list of groups");
                }
                return response.json();
            })
            .then((data) => {
                setPaging(data);
            })
            .catch((error) => {
                pushError(error);
                setLoading(false);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchGroups();
    }, [filter.page, filter.searchValue, filter.status, filter.role]);

    const statusAutocomplete = useCustomAutocomplete({
        list: {
            options: groupStatuses,
            searchFields: ["Name"],
        },
    });


    const handleOnChangeStatus = (status) => {
        setFilter((prev) => ({ ...prev, status, page: 1 }));
    };


    return (
        <div
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div style={{ margin: "16px" }}>
                <WrapperFilter
                    onReset={handleResetFilter}
                    customAction={
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginLeft: "16px",
                                width: "100%",
                                gap: "16px",
                            }}
                        >
                            <select
                                className="form-select block cursor-pointer bg-white border border-grey-300 text-black text-sm rounded-md py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                ref={searchTypeRef}
                                onChange={(e) => {
                                    setFilter((prev) => ({
                                        ...prev,
                                        searchType: e.target.value,
                                    }));
                                }}
                            >
                                {groupSearchTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                            <TextField
                                placeholder="Search"
                                aria-label="Search"
                                ref={searchRef}
                                onChange={(e) => handleOnChangeSearch(e.target.value)}
                            />
                        </div>
                    }
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "16px",
                        }}
                    >
                        <div style={{ width: "50%", paddingRight: "16px" }}>
                            <Autocomplete
                                {...statusAutocomplete}
                                getOptionLabel={(o) => o.Name}
                                value={filter.status}
                                placeholder={"All statuses"}
                                onChange={handleOnChangeStatus}
                            />
                        </div>
                    </div>
                </WrapperFilter>
            </div>

            <BasePaginationList
                titleTotal="Total groups"
                totalItems={paging.totalCount}
                list={paging.data}
                loading={loading}
                renderItem={(group) => (
                    <GroupItem
                        key={group.id}
                        group={group}
                        handleApproveConfirm={(groupId) => handleApproveConfirm(groupId)}
                        handleRejectConfirm={(groupId) => handleRejectConfirm(groupId)}
                    />
                )}
                totalPages={paging.totalPages}
                page={filter.page}
                onChangePage={(page) => setFilter((prev) => ({ ...prev, page }))}
                renderEmpty={() => <NoData>No Data</NoData>}
            />
        </div>
    );
}
