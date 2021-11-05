import { act } from 'react-test-renderer';
import { renderHook } from '@testing-library/react-hooks';

import useSearch from '@/hooks/search';
import RequestHelper from '@/helpers/request';
import { Repository } from '@/models/repository';
import { Background } from '@/lib/background';

const defaultRepositoriesData = {
  apiRepositories: [],
  totalCount: 0,
};
const defaultPageData = {
  skip: 0,
  limit: 20,
  sortProperty: ['stargazersCount'] as Array<keyof Repository>,
  sortOrder: ['DESC'] as ('DESC' | 'ASC')[],
  pageCount: 2,
  currentPage: 1,
  filters: [Background.Dark, Background.Light],
};

describe('useSearch', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    RequestHelper.post = jest.fn();
    localStorage.clear();
  });

  test('should not call the search endpoint on load', () => {
    renderHook(() => useSearch({ defaultRepositoriesData, defaultPageData }));
    expect(RequestHelper.post).not.toHaveBeenCalled();
  });

  test('should call the search endpoint once after a change in search input and a delay', () => {
    const { result, rerender, unmount } = renderHook(() =>
      useSearch({ defaultRepositoriesData, defaultPageData }),
    );

    act(() => {
      result.current.setInput('search');
    });

    rerender();

    expect(RequestHelper.post).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(RequestHelper.post).toHaveBeenCalledTimes(1);

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

    expect(RequestHelper.post).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(RequestHelper.post).not.toHaveBeenCalled();

    unmount();
  });

  test('should call the search endpoint once after a change in current page', () => {
    const { result, rerender, unmount } = renderHook(() =>
      useSearch({ defaultRepositoriesData, defaultPageData }),
    );

    act(() => {
      result.current.setInput('search');
    });

    rerender();

    expect(RequestHelper.post).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(RequestHelper.post).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.setPage(2);
    });

    rerender();

    expect(RequestHelper.post).toHaveBeenCalledTimes(2);

    unmount();
  });
});
