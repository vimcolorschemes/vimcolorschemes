import React, { RefObject, useRef, useState } from 'react';

import Keys from '@/lib/keys';
import useShortcut from '@/hooks/shortcut';

import IconEnter from '@/components/icons/enter';
import IconForwardSlash from '@/components/icons/forwardSlash';

import './index.scss';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

type IconName = 'Search' | 'Enter';

const Icons: Record<IconName, React.ReactNode> = {
  Search: (
    <IconForwardSlash className="search-input__icon search-input__icon--short" />
  ),
  Enter: <IconEnter className="search-input__icon" />,
};

function SearchInput({ value, onChange }: Props) {
  const [icon, setIcon] = useState<React.ReactNode>(Icons.Search);

  const searchInputWrapperRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  function focusOnRef(ref: RefObject<HTMLElement>) {
    ref?.current?.focus();
  }

  useShortcut({
    [Keys.Search]: event => {
      event.preventDefault();
      focusOnRef(searchInputRef);
    },
    [Keys.Undo]: () => onChange(''),
  });

  return (
    <div className="search-input">
      <button
        type="button"
        ref={searchInputWrapperRef}
        className="search-input__overlay-button"
        aria-label={'Search. Press Enter to focus on search input.'}
        onClick={() => {
          focusOnRef(searchInputRef);
        }}
        data-focusable
      />
      <label className="search-input__input-wrapper">
        <input
          type="text"
          tabIndex={-1}
          ref={searchInputRef}
          placeholder="dark, low contrast, ..."
          aria-label={
            'Write a search query and press Enter to focus out of input.'
          }
          className="search-input__input"
          value={value}
          onChange={event => onChange(event.target.value)}
          onFocus={() => setIcon(Icons.Enter)}
          onBlur={() => setIcon(Icons.Search)}
          onKeyDown={event => {
            if (['Enter', 'Escape'].includes(event.key)) {
              event.preventDefault();
              focusOnRef(searchInputWrapperRef);
            }
          }}
        />
        <span className="search-input__icon-wrapper" aria-hidden>
          {icon}
        </span>
      </label>
    </div>
  );
}

export default SearchInput;
