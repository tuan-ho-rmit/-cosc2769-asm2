import React from 'react';

function AutocompleteOption({ option, renderOption, onClick, stackProps, select }) {
  return (
    <div
      className={`cursor-pointer ${stackProps?.className || ''}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.(option);
      }}
      {...stackProps}
    >
      <div
        className={`p-3 transition-all duration-200 rounded-md cursor-pointer ${
          select ? 'bg-lightPrimary]' : ''
        } hover:bg-grey-200`}
      >
        {renderOption(option)}
      </div>
    </div>
  );
}

export default AutocompleteOption;
