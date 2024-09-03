import React from 'react';

function AutocompleteOption({ option, renderOption, onClick, stackProps, select }) {
  return (
    <div
      className={`cursor-pointer ${stackProps?.className || ''} bg-grey-500 text-black`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.(option);
      }}
      {...stackProps}
    >
      <div
        className={`p-3 transition-all duration-200 rounded cursor-pointer ${
          select ? 'bg-lightPrimary' : 'bg-grey-500'
        } hover:bg-grey-400`}
      >
        {renderOption(option)}
      </div>
    </div>
  );
}

export default AutocompleteOption;
