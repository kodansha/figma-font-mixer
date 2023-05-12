import { Style } from "./types";

const STYLES_KEY = 'styles';

export const saveStyles = (styles: Style[]) => {
  figma.root.setPluginData(STYLES_KEY, JSON.stringify(styles));
}

export const loadStyles = (): Style[] => {
  const styles = figma.root.getPluginData(STYLES_KEY);
  console.log(styles)
  return styles ? JSON.parse(styles) : [];
}