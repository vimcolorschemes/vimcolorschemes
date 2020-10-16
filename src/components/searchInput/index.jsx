import React, { useRef, useState } from "react";
import PropTypes from "prop-types";

import { SECTIONS, LAYOUTS } from "src/constants";

import { useKeyboardShortcuts } from "src/hooks/useKeyboardShortcuts";

import { Enter, Slash } from "src/components/icons";

import "./index.scss";

const SEARCH_LABELS = {
  DEFAULT: {
    description: "Search. Press / to focus.",
    render: () => <Slash className="search__icon search__icon--short" />,
  },
  FOCUSED: {
    description: "Press Enter to focus out.",
    render: () => <Enter className="search__icon" />,
  },
};

const SearchInput = ({ value, onChange }) => {
  const [label, setLabel] = useState(SEARCH_LABELS.DEFAULT);

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
          placeholder="dark, contrast, ..."
          aria-label={label.description}
          className="search__input"
          value={value}
          onChange={event => onChange(event.target.value)}
          onFocus={() => setLabel(SEARCH_LABELS.FOCUSED)}
          onBlur={() => setLabel(SEARCH_LABELS.DEFAULT)}
          onKeyDown={event => {
            if (["Enter", "Escape"].includes(event.key)) {
              event.preventDefault();
              searchInputWrapperRef.current.focus();
            }
          }}
        />
        <span className="search__icon-wrapper" aria-hidden>
          {label.render()}
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
