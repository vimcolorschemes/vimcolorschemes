import EnumHelper from '@/helpers/enum';

describe('EnumHelper.getKeys', () => {
  test('should return all keys of the enum', () => {
    enum Test {
      one = 1,
      two_ = '2',
    }

    const keys = EnumHelper.getKeys(Test);

    expect(keys).toEqual(['one', 'two_']);
  });
});
