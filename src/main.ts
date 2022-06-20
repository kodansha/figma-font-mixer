import { emit, on, showUI, setRelaunchButton, saveSettingsAsync, loadSettingsAsync } from "@create-figma-plugin/utilities"
import { Category, Fonts, Settings } from './types'

const mapToObject = (map: Map<string, string[]>): Record<string, string[]> =>
  [...map].reduce((l, [k, v]) => Object.assign(l, { [k]: v }), {})

const isSelectedTextNode = () => {
  return figma.currentPage.selection.length > 0 && figma.currentPage.selection.filter(node => node.type !== "TEXT").length === 0
}

const regexps: Record<Exclude<Category, "normal">, RegExp> = {
  japanese: /(?:[々〇〻\u2E80-\u2FDF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\u3041-\u3096\u30A1-\u30FC\uff1a-\uff20\u3001-\u301b]|[\uD840-\uD87F][\uDC00-\uDFFF])+/g,
  kana: /[\u3041-\u3096\u30A1-\u30FC]+/g,
  // ref: https://tama-san.com/kanji-regex/
  kanji: /(?:[々〇〻\u2E80-\u2FDF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF])+/g,
  yakumono: /[\u3001-\u301b]+/g,
  number: /\d+/g,
}

const defaultFonts: Record<'ja' | 'en', FontName> = {
  ja: {
    family: "Noto Sans JP",
    style: "Medium"
  },
  en: {
    family: "Inter",
    style: "Medium",
  }
}

const defaultSettings: Settings = {
  fontMode: 'simple',
  fonts: {
    japanese: defaultFonts.ja,
    kanji: defaultFonts.ja,
    kana: defaultFonts.ja,
    yakumono: defaultFonts.ja,
    number: defaultFonts.en,
    normal: defaultFonts.en,
  }
}

const styleMapping: Record<string, number> = {
  'Thin': 100,
  'UltraLight': 200,
  'ExtraLight': 200,
  'Light': 300,
  'Regular': 400,
  'Medium': 500,
  'SemiBold': 600,
  'Bold': 700,
  'ExtraBold': 800,
  'Heavy': 800,
  'Black': 900,
  'W0': 100,
  'W1': 200,
  'W2': 250,
  'W3': 300,
  'W4': 400,
  'W5': 500,
  'W6': 600,
  'W7': 700,
  'W8': 800,
  'W9': 900,
}

export default async () => {
  const availableFonts = await figma.listAvailableFontsAsync();
  const fontNames = availableFonts.map(font => font.fontName);

  const families = new Set();
  const styleMap = new Map<string, string[]>()
  fontNames.forEach(font => {
    families.add(font.family);
    if (!styleMap.has(font.family)) {
      styleMap.set(font.family, [font.style]);
    } else {
      styleMap.get(font.family).push(font.style);
    }
  });

  const styles = mapToObject(styleMap)
  Object.keys(styles).map(key => {
    const values = styles[key];
    const sorted = values.map(style => {
      const match = Object.keys(styleMapping).find(pattern => style.includes(pattern))
      const weight = styleMapping[match] ?? 400
      const italic = style.includes('Italic')
      return { label: style, weight, italic }
    })
      .sort((a, b) => a.weight - b.weight - (Number(b.italic) - Number(a.italic)) * 1000)
      .map(({ label }) => label)
    styles[key] = sorted
  })

  const settings = await loadSettingsAsync(defaultSettings, 'fonts')
  const data = {
    families: Array.from(families),
    editable: isSelectedTextNode(),
    styles,
    settings
  }

  showUI({
    width: 300,
    height: 420
  }, data)

  figma.on("selectionchange", async () => {
    emit("selectionchange", {
      editable: isSelectedTextNode()
    });
  });

  on("apply", async (data) => {
    console.log('apply', data)
    const { fonts, fontMode } = data as {
      fontMode: 'simple' | 'advanced'
      fonts: Fonts
    };

    const { japanese, kanji, kana, yakumono, number, normal } = fonts
    const selected = figma.currentPage.selection[0]
    if (!selected || selected.type !== "TEXT") return

    const fontNames = Object.values(fonts)
    for (let i = 0; i < fontNames.length; i++) {
      await figma.loadFontAsync(fontNames[i])
    }

    const categories = fontMode === 'simple' ? { japanese } : { kanji, kana, yakumono, number }
    selected.fontName = normal

    const settings: Settings = { fonts, fontMode }
    await saveSettingsAsync(settings, 'fonts')

    Object.keys(categories).forEach(categoryKey => {
      const regexp = regexps[categoryKey]
      const matches = selected.characters.matchAll(regexp)
      const fontName = categories[categoryKey]
      for (const match of matches) {
        selected.setRangeFontName(match.index, match.index + match[0].length, fontName)
      }
    })

    setRelaunchButton(selected, "openPlugin")
  })
}