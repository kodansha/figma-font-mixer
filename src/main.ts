import { emit, on, showUI, setRelaunchButton, saveSettingsAsync } from "@create-figma-plugin/utilities"
import { Category, Fonts } from './types'

const mapToObject = map =>
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

export default async () => {
  const availableFonts = await figma.listAvailableFontsAsync();
  const fontNames = availableFonts.map(font => font.fontName);

  const families = new Set();
  const styles = new Map()
  fontNames.forEach(font => {
    families.add(font.family);
    if (!styles.has(font.family)) {
      styles.set(font.family, [font.style]);
    } else {
      styles.get(font.family).push(font.style);
    }
  });

  const data = {
    families: Array.from(families),
    styles: mapToObject(styles),
    editable: isSelectedTextNode(),
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
    const { fonts } = data as {
      fonts: Fonts
    };
    const selected = figma.currentPage.selection[0]
    if (!selected || selected.type !== "TEXT") return

    const fontNames = Object.values(fonts)
    for (let i = 0; i < fontNames.length; i++) {
      await figma.loadFontAsync(fontNames[i])
    }

    const { normal, ...categories } = fonts;
    selected.fontName = normal

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