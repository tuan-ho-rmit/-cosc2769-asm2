import { useEffect, useState } from 'react';

function omit(obj, keys) {
    return Object.keys(obj)
        .filter(key => !keys.includes(key))
        .reduce((acc, key) => {
            acc[key] = obj[key];
            return acc;
        }, {});
}
function search(option, searchText, fields) {
    return fields.some((field) => {
      const value = option[field];
      return String(value).toLowerCase().includes(searchText.toLowerCase());
    });
  }
export function useCustomAutocomplete(props) {
    const { listProps } = props;

    const [state, setState] = useState({
        initLoading: !props.disabled,
        searchLoading: false,
        paging: {
            page: 1,
            pageSize: props.listProps?.pageSize || 20,
            rows: [],
            total: 0,
            totalPages: 1,
        },
    });

    const getList = async (_props, reset) => {
        if (props.list) {
            setState(() => {
                const searchText = _props?.search?.content || '';
                const _state = {
                    paging: {
                        page: 1,
                        pageSize: 100000,
                        rows: props.list.options.filter((option) =>
                            props.list.searchOption
                                ? props.list.searchOption(option, searchText)
                                : search(option, searchText, props.list.searchFields),
                        ),
                        total: props.list.options.length,
                        totalPages: 1,
                    },
                    searchLoading: false,
                    initLoading: false,
                };

                return _state;
            });
        } else {
            setState((prev) => ({ ...prev, isNextPageLoading: true }));

            try {
                const _filter = {
                    page: 1,
                    pageSize: 20,
                    filter: {
                        ...(listProps?.filter || {}),
                        ...(_props?.filter || {}),
                    },
                    ...omit(listProps, 'filter'),
                    ...omit(_props, 'filter'),
                    search: {
                        fields: listProps?.search?.fields ?? [],
                        content: _props?.search?.content ?? '',
                    },
                };
                if (reset) {
                    _filter.filter = {};
                    if (_filter.search) _filter.search.content = '';
                    _filter.page = 1;
                }

                const res = await props.getList(_filter);

                setState((prev) => ({
                    initLoading: false,
                    searchLoading: false,
                    isNextPageLoading: false,
                    paging: {
                        ...res,
                        rows: _props?.page === 1 ? res.rows : prev.paging.rows.concat(res.rows),
                    },
                }));
            } catch (error) {
                /* empty */
            }
        }
    };

    const reset = () => {
        setState((prev) => ({ ...prev, initLoading: true }));
        return getList(undefined, true);
    };

    const getListFn = (_props) => {
        setState((prev) => ({ ...prev, initLoading: true }));
        return getList(_props);
    };

    const handleChangeSearch = (text) => {
        setState((prev) => ({ ...prev, searchLoading: true }));
        getList({ page: 1, search: { content: text } });
    };

    useEffect(() => {
        if (!props.disabled) {
            setState((prev) => ({ ...prev, initLoading: true }));
            getList({ page: 1 });
        }
    }, [...(props.dependencyList || [])]);

    const toggleLoading = () => {
        setState((prev) => ({ ...prev, initLoading: !prev.initLoading }));
    };

    return {
        ...props,
        handleChangeSearch,
        paging: state.paging,
        searchLoading: state.searchLoading,
        loading: props.loading || state.initLoading,
        getList: getListFn,
        reset,
        toggleLoading,
    };
}
