import { emit, on, showUI } from "@create-figma-plugin/utilities"

const mapToObject = map =>
  [...map].reduce((l, [k, v]) => Object.assign(l, { [k]: v }), {})

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
  }
  showUI({
    width: 300,
    height: 600
  }, data)

  figma.on("selectionchange", async () => {
    console.log('selectionchange')
  });

  on("apply", async (data) => {
    const { fonts } = data;
    const selected = figma.currentPage.selection[0]
    if (!selected || selected.type !== "TEXT") return
    // latin
    const font = fonts[0]
    // Not latin
    const font2 = fonts[1]
    const fontName: FontName = { family: font.family, style: font.style }
    const fontName2: FontName = { family: font2.family, style: font2.style }
    await figma.loadFontAsync(fontName)
    await figma.loadFontAsync(fontName2)
    selected.fontName = fontName
    const regexp = new RegExp(/[\u0000-\u1EFF\u2070-\u218F\u2C60-\u2C7F\uA720–\uA7FF\uAB30–\uAB6F\uFB00–\uFB4F\uFF00–\uFFEF\u1F00-\u2E7F]+/g)
    const matches = selected.characters.matchAll(regexp)
    for (const match of matches) {
      console.log(match)
      selected.setRangeFontName(match.index, match.index + match[0].length, fontName2)
    }
  })
}