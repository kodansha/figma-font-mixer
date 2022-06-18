
export type Category = 'japanese' | 'kanji' | 'kana' | 'yakumono' | 'number' | 'normal'
export type Fonts = Record<Category, FontName>

export type Settings = {
  fonts: Fonts
  fontMode: 'simple' | 'advanced'
}