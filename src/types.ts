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

export type Style = {
  fonts: Fonts;
  fontMode: FontMode;
  name: string;
}

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

export interface SaveStyleHandler extends EventHandler {
  name: 'SAVE_STYLE';
  handler: (
    data: Style
  ) => void;
}

export interface DeleteStyleHandler extends EventHandler {
  name: 'DELETE_STYLE';
  handler: (
    index: number,
  ) => void;
}

export interface SelectionChangeHandler extends EventHandler {
  name: 'SELECTION_CHANGE';
  handler: (editable: boolean) => void;
}

export interface StylesChangeHandler extends EventHandler {
  name: 'STYLES_CHANGE';
  handler: (styles: Style[]) => void;
}
