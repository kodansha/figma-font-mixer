import { Style } from "./types";

const STYLES_KEY = 'styles';
const VERSION = 1;

export const saveStyles = (styles: Style[]) => {
  const data = {
    version: VERSION,
    styles,
  }
  figma.root.setPluginData(STYLES_KEY, JSON.stringify(data));
}

export const loadStyles = (): Style[] => {
  const rawData = figma.root.getPluginData(STYLES_KEY);
  if (!rawData) return [];
  const data = JSON.parse(rawData);
  return data.styles ?? []
}