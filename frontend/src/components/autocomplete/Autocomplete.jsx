import { useCallback, useEffect, useRef, useState } from 'react';
import AutocompleteOption from './AutoCompleteOption';
import PropTypes from 'prop-types';
import debounce from '../../helper';

const isEqual = (optionA, optionB) => {
    return optionA === optionB;
};

function activeStyles(props, active) {
    return active ? props : undefined;
}

function CustomAutocomplete(props) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState(props.placeholder);
    const [searchLoading, setSearchLoading] = useState(false);

    const { isRequired = false } = props;

    const handleChangeSearch = useCallback(
        debounce((text) => {
            props.handleChangeSearch?.(text);
        }, 300),
        [props.handleChangeSearch],
    );

    const handleClose = () => {
        setOpen(false);
        handleChangeSearch('');
    };

    useEffect(() => {
        setInputValue(props.value ? props.getOptionLabel(props.value) : props.placeholder || "");
    }, [props.value]);

    useEffect(() => {
        if (open) {
            setInputValue('');
        } else {
            setInputValue(props.value ? props.getOptionLabel(props.value) : props.placeholder || "");
        }
    }, [open]);

    useEffect(() => {
        setSearchLoading(props.searchLoading);
    }, [props.paging.rows, props.searchLoading]);

    const items = props.paging.rows;

    const handleChangeText = (e) => {
        setInputValue(e.target.value);
        if (open) {
            handleChangeSearch(e.target.value);
            setSearchLoading(true);
        }
    };

    const refZ = useRef(null);
    const inputContainerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (refZ.current && !refZ.current.contains(event.target)) {
                handleClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={refZ} style={{ width: props.wrapperWidth ?? 'auto' }}>
            <div className="relative">
                <label
                    ref={inputContainerRef}
                    className={`block text-sm font-medium ${isRequired ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''} ${open ? 'focused' : ''}`}
                    id="autocomplete-input"
                >
                    {props.label}
                </label>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChangeText}
                    onFocus={(e) => {
                        if (props.loading || props.disabled || props.readOnly) return;
                        e.preventDefault();
                        e.stopPropagation();
                        setOpen(true);
                    }}
                    autoComplete="off"
                    placeholder={props.placeholder || 'All options'}
                    disabled={props.loading || props.disabled || props.readOnly}
                    className="w-full border-1 rounded transition text-black outline-none py-2 px-4 text-md focus:ring-1 ring-primary"
                />

                {open && (
                    <div className="absolute left-0 w-full mt-1 bg-grey-500 border border-grey-500 rounded-md shadow-lg z-10">
                        <div className="p-3">
                            {!props.disabledAllOption && (
                                <div style={activeStyles({ display: 'none' }, searchLoading)}>
                                    <AutocompleteOption
                                        option={undefined}
                                        select={!props.value}
                                        renderOption={() => (
                                            <p className="m-0">{props.placeholder || 'All options'}</p>
                                        )}
                                        onClick={() => {
                                            handleClose();
                                            props.onChange?.(undefined);
                                            props.handleChangeSearch?.('');
                                        }}
                                    />
                                </div>
                            )}

                            {!searchLoading &&
                                items.map((option) => (
                                    <AutocompleteOption
                                        key={props.getOptionLabel(option)}
                                        option={option}
                                        renderOption={(_option) => (
                                            <div className="flex justify-between">
                                                <p className="m-0">{props.getOptionLabel(_option)}</p>
                                                {props.renderOptionTooltip?.(_option)}
                                            </div>
                                        )}
                                        onClick={(option) => {
                                            handleClose();
                                            props.onChange?.(option);
                                        }}
                                        select={
                                            props.isEqual?.(option, props.value) ?? isEqual(option, props.value)
                                        }
                                    />
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

CustomAutocomplete.propTypes = {
    disabledAllOption: PropTypes.bool,
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
    label: PropTypes.node,
    value: PropTypes.any,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    isEqual: PropTypes.func,
    getOptionLabel: PropTypes.func.isRequired,
    renderOptionTooltip: PropTypes.func,
    handleChangeSearch: PropTypes.func.isRequired,
    searchLoading: PropTypes.bool.isRequired,
    loading: PropTypes.bool,
    paging: PropTypes.shape({
        rows: PropTypes.array.isRequired,
    }).isRequired,
    wrapperWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isRequired: PropTypes.bool,
};
export default CustomAutocomplete;
