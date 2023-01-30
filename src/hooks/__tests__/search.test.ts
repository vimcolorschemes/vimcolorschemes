import { act } from 'react-test-renderer';
import { renderHook } from '@testing-library/react';

import Background from '@/lib/background';
import RequestHelper from '@/helpers/request';
import useSearch from '@/hooks/search';
import { SortProperty } from '@/models/repository';

const defaultRepositoriesData = {
  apiRepositories: [],
  totalCount: 0,
};

const defaultPageData = {
  skip: 0,
  limit: 20,
  sort: [{ stargazersCount: 'DESC' }] as SortProperty[],
  pageCount: 2,
  currentPage: 1,
  filters: [Background.Dark, Background.Light],
};

describe('useSearch', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    RequestHelper.get = jest.fn();
    localStorage.clear();
  });

  test('should not call the search endpoint on load', () => {
    renderHook(() => useSearch({ defaultRepositoriesData, defaultPageData }));
    expect(RequestHelper.get).not.toHaveBeenCalled();
  });

  test('should call the search endpoint once after a change in search input or a page change and a delay', () => {
    const { result, rerender, unmount } = renderHook(() =>
      useSearch({ defaultRepositoriesData, defaultPageData }),
    );

    act(() => {
      result.current.setInput('search');
    });

    rerender();

    expect(RequestHelper.get).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(RequestHelper.get).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.setPage(2);
    });

    rerender();

    expect(RequestHelper.get).toHaveBeenCalledTimes(2);

    unmount();
  });

  test('should not call the search endpoint after a change in current page with no search input', () => {
    const { result, rerender, unmount } = renderHook(() =>
      useSearch({ defaultRepositoriesData, defaultPageData }),
    );

    act(() => {
      result.current.setPage(2);
    });

    rerender();

    expect(RequestHelper.get).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(RequestHelper.get).not.toHaveBeenCalled();

    unmount();
  });
});
