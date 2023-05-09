import {
  emit,
  on,
  showUI,
  setRelaunchButton,
  saveSettingsAsync,
  loadSettingsAsync,
} from '@create-figma-plugin/utilities';
import { Settings, ApplyHandler, SelectionChangeHandler, Category } from './types';
import { UIProps } from './ui';
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

  const families = new Set<string>();
  const styleMap = new Map<string, string[]>();
  fontNames.forEach((font) => {
    families.add(font.family);
    if (!styleMap.has(font.family)) {
      styleMap.set(font.family, [font.style]);
    } else {
      styleMap.get(font.family)?.push(font.style);
    }
  },);

  const familyStyles = mapToObject(styleMap);
  Object.keys(familyStyles).map((key) => {
    const values = familyStyles[key];
    familyStyles[key] = sortStyles(values);
  },);

  const settings = await loadSettingsAsync(defaultSettings, 'fonts');
  const data = {
    families: Array.from(families),
    editable: isSelectedTextNode(),
    familyStyles,
    settings,
  };

  showUI<UIProps>(
    {
      width: 300,
      height: 420,
    },
    data,
  );

  figma.on(
    'selectionchange',
    async () => {
      emit<SelectionChangeHandler>('SELECTION_CHANGE', isSelectedTextNode());
    },
  );

  on<ApplyHandler>(
    'APPLY',
    async (data) => {
      const { fonts, fontMode } = data;

      if (!isSelectedTextNode()) {
        return;
      }

      const fontNames = Object.values(fonts);
      for (let i = 0; i < fontNames.length; i++) {
        await figma.loadFontAsync(fontNames[i]);
      }

      const { japanese, kanji, kana, yakumono, number, normal } = fonts;
      const categories: Partial<Record<Exclude<Category, "normal">, FontName>> = fontMode === 'simple' ? { japanese } : {
        kanji,
        kana,
        yakumono,
        number,
      };

      const settings: Settings = { fonts, fontMode };
      await saveSettingsAsync(settings, 'fonts');

      figma.currentPage.selection.filter(
        (node): node is TextNode => node.type === 'TEXT',
      ).forEach((node) => {
        node.fontName = normal;
        (Object.keys(categories) as (keyof typeof categories)[]).forEach((categoryKey) => {
          const regexp = regexps[categoryKey];
          const matches = node.characters.matchAll(regexp);
          const fontName = categories[categoryKey];
          if (!fontName) return;
          for (const match of matches) {
            node.setRangeFontName(
              (match.index || 0),
              (match.index || 0) + match[0].length,
              fontName,
            );
          }
        },);
        setRelaunchButton(node, 'openPlugin');
      },);
    },
  );
};
