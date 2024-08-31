import React, { useCallback, useEffect, useRef, useState } from 'react'
import UserItem, { userRoles, userStatuses } from './UserItem';
import BasePaginationList from '../../../../components/pagination/BasePaginationList'
import NoData from '../../../../components/pagination/NoData'
import WrapperFilter from '../../../../components/pagination/WrapperFilter'
import { baseUrl } from '../../../../config';
import { pushError, pushSuccess } from '../../../../components/Toast/index'
import debounce from '../../../../helper';
import TextField from '../../../../components/text-field/index'
import Autocomplete from '../../../../components/autocomplete/Autocomplete'
import { useCustomAutocomplete } from '../../../../components/autocomplete/useAutocomplete'
const userSearchTypes = [
    {
        id: 1,
        name: "Username",
        value: "username",
    },
    {
        id: 2,
        name: "Email",
        value: "email",
    },
];


export default function AdminUsers() {
    const pageSize = 5;
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState({
        searchType: userSearchTypes[0],
        page: 1,
        searchValue: "",
        status: undefined,
        role: undefined
    });
    const [paging, setPaging] = useState({
        data: [],
        totalCount: 0,
        totalPages: 0,
    });

    const searchRef = useRef(null);
    const searchTypeRef = useRef(null);
    const handleResetFilter = () => {
        setFilter({ searchValue: "", searchType: userSearchTypes[0], page: 1 });
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
    const handleInactiveCofirm = async (userId) => {
        try {
            const url = new URL(
                `${baseUrl}/api/users/deactivate/${userId}`
            );
            const response = await fetch(url, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                pushSuccess("Inactive user successfully");
                fetchUsers();
            } else {
                pushError("Failed to inactive user");
                throw new Error("Failed to inactive user");
            }
        } catch (error) {
            pushError("Failed to inactive user");
        }
    };
    const handleActiveConfirm = async (userId) => {
        try {
            const url = new URL(
                `${baseUrl}/api/users/activate/${userId}`
            );
            const response = await fetch(url, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                pushSuccess("Active user successfully");
                fetchUsers();
            } else {
                pushError("Failed to active user");
                throw new Error("Failed to active user");
            }
        } catch (error) {
            pushError("Failed to active user");
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        const url = new URL(`${baseUrl}/api/users/list`);
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
                    pushError("Failed to get list user");
                }
                console.log("response: ", response);
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
        fetchUsers();
    }, [filter.page, filter.searchValue, filter.status, filter.role]);

    const statusAutocomplete = useCustomAutocomplete({
        list: {
            options: userStatuses,
            searchFields: ["Name"],
        },
    });
    const roleAutocomplete = useCustomAutocomplete({
        list: {
            options: userRoles,
            searchFields: ["Name"],
        },
    });
    const handleOnChangeStatus = (c) => {
        setFilter((prev) => ({ ...prev, status: c, page: 1 }));
    };
    const handleOnChangeRole = (r) => {
        setFilter((prev) => ({ ...prev, role: r, page: 1 }));
    };
    return (
        <div style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
        }}>
            <div style={{ margin: "16px" }}>
                <WrapperFilter
                    onReset={handleResetFilter}
                    customAction={
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginLeft: "16px", width:"100%", gap:"16px" }}>
                            <select
                                className="form-select block cursor-pointer bg-white border border-grey-300 text-black text-sm rounded-md py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                ref={searchTypeRef}
                                onChange={(e) => {
                                    setFilter((prev) => ({
                                        ...prev,
                                        searchType: e.target.value,
                                    }));
                                }}
                                // style={{ width: "50%" }}
                            >
                                {userSearchTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                            <TextField
                                // style={{ width: "100%" }}
                                placeholder="Search"
                                aria-label="Search"
                                ref={searchRef}
                                onChange={(e) => handleOnChangeSearch(e.target.value)}
                            />
                        </div>
                    }
                >
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
                        <div style={{ width: "50%", paddingRight: "16px" }}>
                            <Autocomplete
                                {...statusAutocomplete}
                                getOptionLabel={(o) => o.Name}
                                // label={"Statuses"}
                                value={filter.status}
                                placeholder={"All statuses"}
                                onChange={(s) => {
                                    handleOnChangeStatus(s);
                                }}
                            ></Autocomplete>
                        </div>
                        <div style={{ width: "50%", paddingLeft: "16px" }}>
                            <Autocomplete
                                {...roleAutocomplete}
                                getOptionLabel={(o) => o.Name}
                                // label={"Statuses"}
                                value={filter.role}
                                placeholder={"All roles"}
                                onChange={(r) => {
                                    handleOnChangeRole(r);
                                }}
                            ></Autocomplete>
                        </div>
                    </div>
                </WrapperFilter>
            </div>

            <BasePaginationList
                titleTotal="Total users"
                totalItems={paging.totalCount}
                list={paging.data}
                loading={loading}
                renderItem={(user) => (
                    <UserItem
                        key={user.id}
                        user={user}
                        handleActiveConfirm={(userId) => handleActiveConfirm(userId)}
                        handleInactiveCofirm={(userId) => handleInactiveCofirm(userId)}
                    />
                )}
                totalPages={paging.totalPages}
                page={filter.page}
                onChangePage={(page) => setFilter((prev) => ({ ...prev, page }))}
                renderEmpty={() => <NoData>No Data</NoData>}
            />
        </div>
    )
}
