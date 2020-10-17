import React, { useRef, useState } from "react";
import PropTypes from "prop-types";

import { SECTIONS, LAYOUTS } from "src/constants";

import { useKeyboardShortcuts } from "src/hooks/useKeyboardShortcuts";

import { Enter, Slash } from "src/components/icons";

import "./index.scss";

const SEARCH_ICONS = {
  DEFAULT: <Slash className="search__icon search__icon--short" />,
  FOCUSED: <Enter className="search__icon" />,
};

const SearchInput = ({ value, onChange }) => {
  const [icon, setIcon] = useState(SEARCH_ICONS.DEFAULT);

  const searchInputWrapperRef = useRef();
  const searchInputRef = useRef();

  useKeyboardShortcuts({
    "/": event => {
      event.preventDefault();
      searchInputRef.current.focus();
    },
    u: () => onChange(""),
  });

  return (
    <div className="search">
      <button
        type="button"
        ref={searchInputWrapperRef}
        className="search__overlay-button"
        data-section={SECTIONS.ACTIONS}
        data-layout={LAYOUTS.LIST}
        aria-label={"Search. Press Enter to focus on search input."}
        onClick={() => {
          searchInputRef.current.focus();
        }}
      />
      <label className="search__input-wrapper">
        <input
          type="text"
          id="search-input"
          name="search-input"
          tabIndex={-1}
          ref={searchInputRef}
          placeholder="dark, low contrast, ..."
          aria-label={
            "Write a search query and press Enter to focus out of input."
          }
          className="search__input"
          value={value}
          onChange={event => onChange(event.target.value)}
          onFocus={() => setIcon(SEARCH_ICONS.FOCUSED)}
          onBlur={() => setIcon(SEARCH_ICONS.DEFAULT)}
          onKeyDown={event => {
            if (["Enter", "Escape"].includes(event.key)) {
              event.preventDefault();
              searchInputWrapperRef.current.focus();
            }
          }}
        />
        <span className="search__icon-wrapper" aria-hidden>
          {icon}
        </span>
      </label>
    </div>
  );
};

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SearchInput;
