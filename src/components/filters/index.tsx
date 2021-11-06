import React, { useMemo } from 'react';
import { navigate } from 'gatsby';

import Routes from '@/lib/routes';
import { Action } from '@/lib/actions';
import Background from '@/lib/background';

import './index.scss';

interface Props {
  activeFilters: Background[];
  activeAction: Action;
}

const BACKGROUND_FILTERS_ID = 'background-filters';

function Filters({ activeFilters, activeAction }: Props) {
  const isLightFilterChecked = useMemo(
    () => activeFilters.includes(Background.Light),
    [activeFilters],
  );

  const isDarkFilterChecked = useMemo(
    () => activeFilters.includes(Background.Dark),
    [activeFilters],
  );

  function onChangeFilters(
    isLightFilterChecked: boolean,
    isDarkFilterChecked: boolean,
  ) {
    let nextRoute = '';

    if (isLightFilterChecked && !isDarkFilterChecked) {
      nextRoute = Routes.Light;
    }

    if (isDarkFilterChecked && !isLightFilterChecked) {
      nextRoute = Routes.Dark;
    }

    navigate(nextRoute + activeAction.route, {
      state: { focusSelector: `#${BACKGROUND_FILTERS_ID} input:checked` },
    });
  }

  return (
    <div className="filters">
      <span>filter by:</span>
      <fieldset id={BACKGROUND_FILTERS_ID} className="filters__inputs">
        <label className="filters__input-container">
          <input
            type="radio"
            name="background"
            value="all"
            checked={isDarkFilterChecked && isLightFilterChecked}
            data-focusable={isDarkFilterChecked && isLightFilterChecked}
            onChange={event =>
              event.target.checked && onChangeFilters(true, true)
            }
            className="filters__input"
          />
          <span>all</span>
        </label>
        <label className="filters__input-container">
          <input
            type="radio"
            name="background"
            value="light"
            checked={isLightFilterChecked && !isDarkFilterChecked}
            data-focusable={isLightFilterChecked && !isDarkFilterChecked}
            onChange={event =>
              event.target.checked && onChangeFilters(true, false)
            }
            className="filters__input"
          />
          <span>light</span>
        </label>
        <label className="filters__input-container">
          <input
            type="radio"
            name="background"
            value="dark"
            checked={isDarkFilterChecked && !isLightFilterChecked}
            data-focusable={isDarkFilterChecked && !isLightFilterChecked}
            onChange={event =>
              event.target.checked && onChangeFilters(false, true)
            }
            className="filters__input"
          />
          <span>dark</span>
        </label>
      </fieldset>
    </div>
  );
}

export default Filters;
