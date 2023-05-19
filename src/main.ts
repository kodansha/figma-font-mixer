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
      ).forEach(async (node) => {
        let start = 0;
        let end = node.characters.length;
        let characters = node.characters;

        // 部分選択の場合は選択された部分のみに適用する
        const selectedTextRange = figma.currentPage.selectedTextRange
        if (selectedTextRange && selectedTextRange.node.id === node.id && selectedTextRange.start !== selectedTextRange.end) {
          start = selectedTextRange.start;
          end = selectedTextRange.end;
          characters = node.characters.substring(start, end);

          const currentFonts = node.getRangeAllFontNames(0, node.characters.length)
          for (let i = 0; i < currentFonts.length; i++) {
            await figma.loadFontAsync(currentFonts[i]);
          }
          node.setRangeFontName(start, end, normal)
        } else {
          node.fontName = normal;
        }

        (Object.keys(categories) as (keyof typeof categories)[]).forEach((categoryKey) => {
          const regexp = regexps[categoryKey];
          const matches = characters.matchAll(regexp);
          const fontName = categories[categoryKey];
          if (!fontName) return;
          for (const match of matches) {
            // console.log('match', match[0])
            const startIndex = start + (match.index || 0)
            node.setRangeFontName(startIndex, startIndex + match[0].length, fontName,);
          }
        },);
        setRelaunchButton(node, 'openPlugin');
      },);
    },
  );
};
