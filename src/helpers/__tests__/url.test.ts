import URLHelper from '@/helpers/url';
import { Actions } from '@/lib/actions';

describe('URLHelper.urlify', () => {
  test('should trim value', () => {
    expect(URLHelper.urlify('  http://test.com')).toEqual('http://test.com');
    expect(URLHelper.urlify('http://test.com  ')).toEqual('http://test.com');
    expect(URLHelper.urlify('  http://test.com  ')).toEqual('http://test.com');
  });

  test('should replace spaces with encoded value', () => {
    expect(URLHelper.urlify('http://test.com?name=first last')).toEqual(
      'http://test.com?name=first%20last',
    );
  });

  test('should return empty string if value is undefined', () => {
    expect(URLHelper.urlify(null as any)).toEqual('');
    expect(URLHelper.urlify(undefined as any)).toEqual('');
  });
});

describe('URLHelper.URLHelper.paginateRoute', () => {
  test('should return home path with undefined values', () => {
    expect(URLHelper.paginateRoute(null as any, null as any)).toBe('/');
    expect(URLHelper.paginateRoute(undefined as any, undefined as any)).toBe(
      '/',
    );
    expect(URLHelper.paginateRoute(null as any, undefined as any)).toBe('/');
    expect(URLHelper.paginateRoute(undefined as any, null as any)).toBe('/');
  });

  test('should return no page specification when page number is less than 2', () => {
    expect(URLHelper.paginateRoute('', 0)).toBe('');
    expect(URLHelper.paginateRoute('', -1)).toBe('');
    expect(URLHelper.paginateRoute('', 1)).toBe('');

    expect(URLHelper.paginateRoute('about', 0)).toBe('about');
    expect(URLHelper.paginateRoute('about', -1)).toBe('about');
    expect(URLHelper.paginateRoute('about', 1)).toBe('about');

    expect(URLHelper.paginateRoute('/about', 0)).toBe('/about');
    expect(URLHelper.paginateRoute('/about', -1)).toBe('/about');
    expect(URLHelper.paginateRoute('/about', 1)).toBe('/about');
  });

  test('should add page specification when page number is more than 1', () => {
    expect(URLHelper.paginateRoute('', 2)).toBe('/page/2');

    expect(URLHelper.paginateRoute('about', 2)).toBe('about/page/2');

    expect(URLHelper.paginateRoute('/repositories', 2)).toBe(
      '/repositories/page/2',
    );
  });

  test('should allow multiple path parts', () => {
    expect(URLHelper.paginateRoute('/options/repositories', 1)).toBe(
      '/options/repositories',
    );
    expect(URLHelper.paginateRoute('/options/repositories', 2)).toBe(
      '/options/repositories/page/2',
    );
  });
});

describe('URLHelper.getPageFromURL', () => {
  test('should return page number if present in the URL', () => {
    expect(URLHelper.getPageFromURL('/page/2')).toEqual(2);
    expect(URLHelper.getPageFromURL('/options/page/2')).toEqual(2);
    expect(URLHelper.getPageFromURL('/options/repositories/page/2')).toEqual(2);
    expect(
      URLHelper.getPageFromURL('/options/repositories/page/page/2'),
    ).toEqual(2);
  });

  test('should return page 1 if no page specifications are present in the URL', () => {
    expect(URLHelper.getPageFromURL('/')).toEqual(1);
    expect(URLHelper.getPageFromURL('/repositories')).toEqual(1);
    expect(URLHelper.getPageFromURL('/repositories/options')).toEqual(1);
    expect(URLHelper.getPageFromURL('/pag/2')).toEqual(1);
  });

  test('should return page 1 if page specifications is not a valid number', () => {
    expect(URLHelper.getPageFromURL('/page')).toEqual(1);
    expect(URLHelper.getPageFromURL('/page/')).toEqual(1);
    expect(URLHelper.getPageFromURL('/page/one')).toEqual(1);
  });

  test('should return 1 if page specification is less than 1', () => {
    expect(URLHelper.getPageFromURL('/page/-1')).toEqual(1);
    expect(URLHelper.getPageFromURL('/page/0')).toEqual(1);
  });
});

describe('URLHelper.getActionFromURL', () => {
  test('should return action when an exact match is found', () => {
    expect(URLHelper.getActionFromURL('/')).toEqual(Actions.Trending);
    expect(URLHelper.getActionFromURL('/top')).toEqual(Actions.Top);
    expect(URLHelper.getActionFromURL('/recently-updated')).toEqual(
      Actions.RecentlyUpdated,
    );
    expect(URLHelper.getActionFromURL('/new')).toEqual(Actions.New);
    expect(URLHelper.getActionFromURL('/old')).toEqual(Actions.Old);
  });

  test('should return action when the URL contains the action route', () => {
    expect(URLHelper.getActionFromURL('/page/2')).toEqual(Actions.Trending);
    expect(URLHelper.getActionFromURL('/top/page/2')).toEqual(Actions.Top);
    expect(URLHelper.getActionFromURL('/recently-updated/page/2')).toEqual(
      Actions.RecentlyUpdated,
    );
    expect(URLHelper.getActionFromURL('/new/page/2')).toEqual(Actions.New);
    expect(URLHelper.getActionFromURL('/old/page/2')).toEqual(Actions.Old);
  });

  test('should return Trending action when no other match is found', () => {
    expect(URLHelper.getActionFromURL('/test')).toEqual(Actions.Trending);
    expect(URLHelper.getActionFromURL('')).toEqual(Actions.Trending);
  });
});
