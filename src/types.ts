import type { EventHandler } from '@create-figma-plugin/utilities';

export type SimpleCategory = 'normal' | 'japanese';
export type AdvancedCategory =
  | 'kanji'
  | 'kana'
  | 'yakumono'
  | 'number'
  | 'normal';

export const SIMPLE_CATEGORIES = ['japanese', 'normal'] as const;
export const ADVANCED_CATEGORIES = [
  'kanji',
  'kana',
  'yakumono',
  'number',
  'normal',
] as const;
export type Category = SimpleCategory | AdvancedCategory;
export type Fonts = Record<Category, FontName>;
export type SavedFonts =
  | Record<SimpleCategory, FontName>
  | Record<AdvancedCategory, FontName>;

export type FontMode = 'simple' | 'advanced';

export type Style = {
  fonts: SavedFonts;
  fontMode: FontMode;
  name: string;
};

export type Settings = {
  fonts: Fonts;
  fontMode: FontMode;
};

export interface ApplyHandler extends EventHandler {
  name: 'APPLY';
  handler: (data: {
    fonts: Fonts;
    fontMode: FontMode;
    saveSettings?: boolean;
  }) => void;
}

export interface SaveStyleHandler extends EventHandler {
  name: 'SAVE_STYLE';
  handler: (data: {
    fonts: Fonts;
    fontMode: FontMode;
    name: string;
  }) => void;
}

export interface DeleteStyleHandler extends EventHandler {
  name: 'DELETE_STYLE';
  handler: (index: number) => void;
}

export interface SelectionChangeHandler extends EventHandler {
  name: 'SELECTION_CHANGE';
  handler: (editable: boolean) => void;
}

export interface StylesChangeHandler extends EventHandler {
  name: 'STYLES_CHANGE';
  handler: (styles: Style[]) => void;
}
