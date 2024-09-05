import React from 'react'
import WrapperFilter from '../../../../components/pagination/WrapperFilter';
import PostItem from './PostItem';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import debounce from '../../../../helper';
import TextField from '../../../../components/text-field';
import BasePaginationList from '../../../../components/pagination/BasePaginationList';
import NoData from '../../../../components/pagination/NoData';
import { pushError, pushSuccess } from '../../../../components/Toast';
import { baseUrl } from '../../../../config';


const postSearchTypes = [
    {
        id: 1,
        name: "Content",
        value: "content",
    },
    {
        id: 2,
        name: "Author",
        value: "author",
    },
    {
        id: 3,
        name: "Group",
        value: "group",
    }
];
export default function AdminPosts() {
    const pageSize = 5;
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState({
        searchType: postSearchTypes[0],
        page: 1,
        searchValue: "",
    });
    const [paging, setPaging] = useState({
        data: [],
        totalCount: 0,
        totalPages: 0,
    });

    const searchRef = useRef(null);
    const searchTypeRef = useRef(null);
    const handleResetFilter = () => {
        setFilter({ searchValue: "", searchType: postSearchTypes[0], page: 1 });
        if (searchRef.current) {
            searchRef.current.value = "";
        }
    };
    const handleOnChangeSearch = useCallback(
        debounce((value) => {
            setFilter((prev) => {
                console.log("🚀 ~ debounce ~ prev:", prev)
                return ({ ...prev, searchValue: value, page: 1 })
            })
        }, 300),
        []
    );

    const handleDeleteConfirm = async (postId) => {
        try {
            const url = new URL(
                `${baseUrl}/api/posts/${postId}`
            );
            const response = await fetch(url, {
                method: "Delete",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                pushSuccess("Delete post successfully");
                fetchPosts();
            } else {
                pushError("Failed to delete post");
                throw new Error("Failed to delete post");
            }
        } catch (error) {
            pushError("Failed to delete post");
        }
    };

    const fetchPosts = async () => {
        setLoading(true);
        const url = new URL(`${baseUrl}/api/posts/list`);
        url.searchParams.append("page", filter.page);
        url.searchParams.append("limit", pageSize);
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
                    pushError("Failed to get list posts");
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
        fetchPosts();
    }, [filter.page, filter.searchValue, filter.status, filter.role]);

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
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", gap: "16px" }}>
                            <select
                                className="form-select block w-[200px] cursor-pointer bg-white border border-grey-300 text-black text-sm rounded-md py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                ref={searchTypeRef}
                                onChange={(e) => {
                                    setFilter((prev) => {
                                        return { ...prev, searchType: e.target.value };
                                    });
                                }}
                            >
                                {postSearchTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                            <TextField
                                placeholder="Search"
                                aria-label="Search"
                                ref={searchRef}
                                onChange={(e) => {
                                    handleOnChangeSearch(e.target.value);
                                }}
                            />
                        </div>

                    }
                >
                </WrapperFilter>
            </div>

            <BasePaginationList
                titleTotal="Total posts"
                totalItems={paging.totalCount}
                list={paging.data}
                loading={loading}
                renderItem={(post) => (
                    <PostItem
                        key={post.id}
                        post={post}
                        handleDeleteConfirm={(postId) => handleDeleteConfirm(postId)}
                    />
                )}
                totalPages={paging.totalPages}
                page={filter.page}
                onChangePage={(page) => setFilter((prev) => ({ ...prev, page }))}
                renderEmpty={() => <NoData>No Data</NoData>}
            />
        </div>)
}
