import { EventHandler } from '@create-figma-plugin/utilities';

export type Category =
  | 'japanese'
  | 'kanji'
  | 'kana'
  | 'yakumono'
  | 'number'
  | 'normal';
export type Fonts = Record<Category, FontName>;

type FontMode = 'simple' | 'advanced';

export type Settings = {
  fonts: Fonts;
  fontMode: FontMode;
};

export interface ApplyHandler extends EventHandler {
  name: 'APPLY';
  handler: (
    data: {
      fonts: Fonts;
      fontMode: FontMode;
    },
  ) => void;
}

export interface SelectionChangeHandler extends EventHandler {
  name: 'SELECTION_CHANGE';
  handler: (editable: boolean) => void;
}
