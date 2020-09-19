import React, { useRef, useState } from "react";

import { SECTIONS, LAYOUTS } from "src/constants";

import { useEventListener } from "src/hooks/useEventListener";

import "./index.scss";

const SEARCH_LABELS = {
  DEFAULT: "/",
  FOCUSED: "Enter",
};

const SearchInput = ({ value, onChange, onFocusChange }) => {
  const [label, setLabel] = useState(SEARCH_LABELS.DEFAULT);

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
      className="search"
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
        ref={searchInputRef}
        className="search__input"
        value={value}
        onChange={onChange}
        placeholder="dark, contrast, ..."
        onFocus={() => {
          onFocusChange(true);
          setLabel(SEARCH_LABELS.FOCUSED);
        }}
        onBlur={() => {
          onFocusChange(false);
          setLabel(SEARCH_LABELS.DEFAULT);
        }}
        onKeyDown={event => {
          if (["Enter", "Escape"].includes(event.key))
            searchInputWrapperRef.current.focus();
        }}
      />
      <span className="search__label">{label}</span>
    </label>
  );
};

export default SearchInput;
