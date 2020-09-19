import React, { useRef } from "react";

import { SECTIONS, LAYOUTS } from "src/constants";

import { useEventListener } from "src/hooks/useEventListener";

const SearchInput = ({ value, onChange, onFocusChange }) => {
  const searchInputWrapperRef = useRef();
  const searchInputRef = useRef();

  useEventListener("keydown", event => {
    if (event.key === "/" && !!searchInputRef?.current?.focus) {
      event.preventDefault();
      searchInputRef.current.focus();
    }
  });

  return (
    <label
      ref={searchInputWrapperRef}
      className="actions-row__search-input-wrapper"
      data-section={SECTIONS.ACTIONS}
      data-layout={LAYOUTS.LIST}
      tabIndex="0"
      onKeyDown={event => {
        if (event.target !== searchInputWrapperRef.current) return;
        if (event.key === "Enter") {
          searchInputRef.current.focus();
        }
      }}
    >
      <input
        type="text"
        value={value}
        ref={searchInputRef}
        className="actions-row__search-input"
        onChange={onChange}
        onFocus={() => onFocusChange(true)}
        onBlur={() => onFocusChange(false)}
        onKeyDown={event => {
          if (["Enter", "Escape"].includes(event.key))
            searchInputWrapperRef.current.focus();
        }}
      />
    </label>
  );
};

export default SearchInput;
