import {
  Container,
  IconButton,
  IconTrash24,
  Muted,
  Text,
  VerticalSpace,
} from '@create-figma-plugin/ui';
import { emit } from '@create-figma-plugin/utilities';
import { h } from 'preact';
import { StyleIcon } from '../components/style-icon';
import type {
  AdvancedCategory,
  ApplyHandler,
  DeleteStyleHandler,
  Fonts,
  SimpleCategory,
  Style,
} from '../types';
import { ADVANCED_CATEGORIES, SIMPLE_CATEGORIES } from '../types';
import { getFontWeight } from '../utils';
import cssStyles from './styles.module.css';

const readableText = (style: Style) => {
  const { fonts: _fonts, fontMode } = style;
  if (fontMode === 'simple') {
    const fonts = _fonts as Record<SimpleCategory, FontName>;
    return SIMPLE_CATEGORIES.map((c) => `${fonts[c].family} ${fonts[c].style}`)
      .filter((v, i, a) => a.indexOf(v) === i)
      .join(', ');
  }
  if (fontMode === 'advanced') {
    const fonts = _fonts as Record<AdvancedCategory, FontName>;
    return ADVANCED_CATEGORIES.map((c) => fonts[c].family)
      .filter((v, i, a) => a.indexOf(v) === i)
      .join(', ');
  }
};

const estimateWeight = (style: Style): number => {
  const { fonts: _fonts, fontMode } = style;
  if (fontMode === 'simple') {
    const fonts = _fonts as Record<SimpleCategory, FontName>;
    return (
      SIMPLE_CATEGORIES.map((c) => getFontWeight(fonts[c].style)).reduce(
        (a, b) => a + b,
        0,
      ) / SIMPLE_CATEGORIES.length
    );
  }
  if (fontMode === 'advanced') {
    const fonts = _fonts as Record<AdvancedCategory, FontName>;
    return (
      ADVANCED_CATEGORIES.map((c) => getFontWeight(fonts[c].style)).reduce(
        (a, b) => a + b,
        0,
      ) / ADVANCED_CATEGORIES.length
    );
  }
  return 400;
};

export const StylesTab = ({
  styles,
}: {
  styles: Style[];
}) => {
  return (
    <div style={{ padding: '8px 0' }}>
      {styles.length === 0 && (
        <Container space="medium">
          <VerticalSpace space="small" />
          <Text>
            <Muted>There are no styles</Muted>
          </Text>
        </Container>
      )}
      {styles.map((style: Style, index: number) => {
        const familyText = readableText(style);
        return (
          <div
            key={`${style.name} - ${familyText}`}
            title={`${style.name} - ${familyText}`}
            className={cssStyles.row}
            onClick={() => {
              console.log('ciicked', style);
              emit<ApplyHandler>('APPLY', {
                fonts: style.fonts as Fonts,
                fontMode: style.fontMode,
              });
            }}
          >
            <span style={{ flexShrink: 0, margin: '0 4px 0 -8px' }}>
              <StyleIcon weight={estimateWeight(style)} />
            </span>
            <span className={cssStyles.name}>
              {style.name}
              <span style={{ marginLeft: 4, opacity: 0.6 }}>
                - {familyText}
              </span>
            </span>
            <div className={cssStyles.deleteButton}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  emit<DeleteStyleHandler>('DELETE_STYLE', index);
                }}
              >
                <IconTrash24 />
              </IconButton>
            </div>
          </div>
        );
      })}
    </div>
  );
};
