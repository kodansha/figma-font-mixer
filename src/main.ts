import {
  emit,
  on,
  showUI,
  setRelaunchButton,
  saveSettingsAsync,
  loadSettingsAsync,
} from '@create-figma-plugin/utilities';
import { Fonts, Settings } from './types';
import { sortStyles, regexps, defaultSettings } from './utils';

const mapToObject = (map: Map<string, string[]>): Record<string, string[]> =>
  [...map].reduce((l, [k, v]) => Object.assign(l, { [k]: v }), {});

const isSelectedTextNode = () => {
  return figma.currentPage.selection.length > 0 && figma.currentPage.selection.filter(
    (node) => node.type !== 'TEXT',
  ).length === 0;
};

export default async () => {
  const availableFonts = await figma.listAvailableFontsAsync();
  const fontNames = availableFonts.map((font) => font.fontName);

  const families = new Set();
  const styleMap = new Map<string, string[]>();
  fontNames.forEach((font) => {
    families.add(font.family);
    if (!styleMap.has(font.family)) {
      styleMap.set(font.family, [font.style]);
    } else {
      styleMap.get(font.family).push(font.style);
    }
  },);

  const styles = mapToObject(styleMap);
  Object.keys(styles).map((key) => {
    const values = styles[key];
    styles[key] = sortStyles(values);
  },);

  const settings = await loadSettingsAsync(defaultSettings, 'fonts');
  const data = {
    families: Array.from(families),
    editable: isSelectedTextNode(),
    styles,
    settings,
  };

  showUI(
    {
      width: 300,
      height: 420,
    },
    data,
  );

  figma.on(
    'selectionchange',
    async () => {
      emit(
        'selectionchange',
        {
          editable: isSelectedTextNode(),
        },
      );
    },
  );

  on(
    'apply',
    async (data) => {
      console.log('apply', data);
      const { fonts, fontMode } = data as {
        fontMode: 'simple' | 'advanced';
        fonts: Fonts;
      };

      const selected = figma.currentPage.selection[0];
      if (!selected || selected.type !== 'TEXT') {
        return;
      }

      const fontNames = Object.values(fonts);
      for (let i = 0; i < fontNames.length; i++) {
        await figma.loadFontAsync(fontNames[i]);
      }

      const { japanese, kanji, kana, yakumono, number, normal } = fonts;
      const categories = fontMode === 'simple' ? { japanese } : {
        kanji,
        kana,
        yakumono,
        number,
      };
      selected.fontName = normal;

      const settings: Settings = { fonts, fontMode };
      await saveSettingsAsync(settings, 'fonts');

      Object.keys(categories).forEach((categoryKey) => {
        const regexp = regexps[categoryKey];
        const matches = selected.characters.matchAll(regexp);
        const fontName = categories[categoryKey];
        for (const match of matches) {
          selected.setRangeFontName(
            match.index,
            match.index + match[0].length,
            fontName,
          );
        }
      },);

      setRelaunchButton(selected, 'openPlugin');
    },
  );
};
