import letterAspectRatio from './letterAspectRatio';
/**
 *
 * @param letter the letter
 * @param fontSize
 * @return the letter's width
 */

export const getLetterWidth = function getLetterWidth(letter, fontSize) {
  return fontSize * (letterAspectRatio[letter] || 1);
};
/**
 *
 * @param text the text
 * @param fontSize
 * @return the text's size
 */

export const getTextWidth = function getTextSize(text, fontSize) {
  let width = 0;
  const pattern = new RegExp('[\u4E00-\u9FA5]+');
  String(text).split('').forEach((letter) => {
    if (pattern.test(letter)) {
      // 中文字符
      width += fontSize;
    } else {
      width += getLetterWidth(letter, fontSize);
    }
  });
  width = Math.ceil(width);
  return [width, fontSize];
};
