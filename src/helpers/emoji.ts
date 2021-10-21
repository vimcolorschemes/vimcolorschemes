import EmojiConverter from 'emoji-js';

const emojiConverter = new EmojiConverter();

// Force convert mode to unicode
emojiConverter.replace_mode = 'unified';

/**
 * Convert colon emojis (ex: ':package:') to their emoji equivalent
 *
 * @param {string} value - The value to parse and convert the emojis in
 * @returns {string} The value with its colon emojis converted
 */
function convertColonEmojis(value: string): string {
  if (!value) {
    return '';
  }

  return emojiConverter.replace_colons(value);
}

const EmojiHelper = {
  convertColonEmojis,
};

export default EmojiHelper;
