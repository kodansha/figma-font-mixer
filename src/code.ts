figma.showUI(__html__);

const mapToObject = map =>
  [...map].reduce((l, [k, v]) => Object.assign(l, { [k]: v }), {})

const init = async () => {
  const availableFonts = await figma.listAvailableFontsAsync();
  const fontNames = availableFonts.map(font => font.fontName);

  console.log(availableFonts)
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

  console.log(families, styles)


  figma.ui.postMessage({
    type: "load-fonts",
    data: {
      families: Array.from(families),
      styles: mapToObject(styles),
    }
  })
}

init()

let selected = null

figma.on("selectionchange", async () => {
  console.log('selectionchange')
});

figma.ui.onmessage = async (msg) => {
  if (msg.type === "apply") {
    console.log('apply', msg)
    const selected = figma.currentPage.selection[0]
    if (!selected || selected.type !== "TEXT") return
    const fontName = { family: msg.family, style: msg.style }
    await figma.loadFontAsync(fontName)
    selected.fontName = fontName
    return
  }

  figma.closePlugin();
};
