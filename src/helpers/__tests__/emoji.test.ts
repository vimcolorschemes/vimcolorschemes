import EmojiHelper from '@/helpers/emoji';

describe('EmojiHelper.convertColonEmojis', () => {
  test('should return empty string for an invalid value', () => {
    expect(EmojiHelper.convertColonEmojis(null as any)).toBe('');
    expect(EmojiHelper.convertColonEmojis(undefined as any)).toBe('');
    expect(EmojiHelper.convertColonEmojis('')).toBe('');
  });

  test('should return the same value if no colon emoji is found', () => {
    expect(EmojiHelper.convertColonEmojis('Test value')).toBe('Test value');
    expect(EmojiHelper.convertColonEmojis('Test value 📦')).toBe(
      'Test value 📦',
    );
  });

  test('should convert all colon emojis', () => {
    expect(EmojiHelper.convertColonEmojis('Test value :smile:')).toBe(
      'Test value 😄',
    );
    expect(EmojiHelper.convertColonEmojis('Test value :smile: :boat:')).toBe(
      'Test value 😄 ⛵',
    );
    expect(EmojiHelper.convertColonEmojis(':package: :smile: :boat:')).toBe(
      '📦 😄 ⛵',
    );
  });
});
