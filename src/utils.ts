import { Category, Settings } from './types';

const defaultFonts: Record<'ja' | 'en', FontName> = {
  ja: {
    family: 'Noto Sans JP',
    style: 'Medium',
  },
  en: {
    family: 'Inter',
    style: 'Medium',
  },
};

export const defaultSettings: Settings = {
  fontMode: 'simple',
  fonts: {
    japanese: defaultFonts.ja,
    kanji: defaultFonts.ja,
    kana: defaultFonts.ja,
    yakumono: defaultFonts.ja,
    number: defaultFonts.en,
    normal: defaultFonts.en,
  },
};

const styleMapping: Record<string, number> = {
  Thin: 100,
  UltraLight: 200,
  ExtraLight: 200,
  Light: 300,
  Regular: 400,
  Medium: 500,
  SemiBold: 600,
  Bold: 700,
  ExtraBold: 800,
  Heavy: 800,
  Black: 900,
  W0: 100,
  W1: 200,
  W2: 250,
  W3: 300,
  W4: 400,
  W5: 500,
  W6: 600,
  W7: 700,
  W8: 800,
  W9: 900,
};

export const sortStyles = (styles: string[]) => {
  const sorted = styles
    .map((style) => {
      const match = Object.keys(styleMapping).find(
        (pattern) => style.includes(pattern),
      );
      const weight = styleMapping[match] ?? 400;
      const italic = style.includes('Italic');
      return { label: style, weight, italic };
    },)
    .sort(
      (a, b) =>
        a.weight - b.weight - ((Number(b.italic) - Number(a.italic)) * 1000),
    )
    .map(({ label }) => label);
  return sorted;
};

export const regexps: Record<Exclude<Category, 'normal'>, RegExp> = {
  japanese:
    /(?:[々〇〻\u2E80-\u2FDF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\u3041-\u3096\u30A1-\u30FC\uff1a-\uff20\u3001-\u301b]|[\uD840-\uD87F][\uDC00-\uDFFF])+/g,
  kana: /[\u3041-\u3096\u30A1-\u30FC]+/g,
  // ref: https://tama-san.com/kanji-regex/
  kanji:
    /(?:[々〇〻\u2E80-\u2FDF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF])+/g,
  yakumono: /[\u3001-\u301b]+/g,
  number: /\d+/g,
};
