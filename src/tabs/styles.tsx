import { h } from 'preact';
import { emit } from '@create-figma-plugin/utilities';
import {
  IconTrash32,
  IconButton,
  Container,
  VerticalSpace,
  Text,
  Muted,
} from '@create-figma-plugin/ui';
import type {
  AdvancedCategory,
  ApplyHandler,
  DeleteStyleHandler,
  SimpleCategory,
  Style,
} from '../types';
import cssStyles from './styles.module.css';
import { getFontWeight } from '../utils';
import { StyleIcon } from '../components/style-icon';

const readableText = (style: Style) => {
  const { fonts: _fonts, fontMode } = style;
  if (fontMode === 'simple') {
    const fonts = _fonts as Record<SimpleCategory, FontName>;
    return [
      `${fonts['japanese'].family} ${fonts['japanese'].style}`,
      `${fonts['normal'].family} ${fonts['normal'].style}`,
    ]
      .filter((v, i, a) => a.indexOf(v) === i)
      .join(', ');
  }
  if (fontMode === 'advanced') {
    const fonts = _fonts as Record<AdvancedCategory, FontName>;
    return [
      fonts['kanji'].family,
      fonts['kana'].family,
      fonts['yakumono'].family,
      fonts['number'].family,
      fonts['normal'].family,
    ]
      .filter((v, i, a) => a.indexOf(v) === i)
      .join(', ');
  }
};

const estimateWeight = (style: Style): number => {
  const { fonts: _fonts, fontMode } = style;
  if (fontMode === 'simple') {
    const fonts = _fonts as Record<SimpleCategory, FontName>;
    return (
      [
        getFontWeight(fonts.japanese.style),
        getFontWeight(fonts.normal.style),
      ].reduce((a, b) => a + b, 0) / 2
    );
  }if (fontMode === 'advanced') {
    const fonts = _fonts as Record<AdvancedCategory, FontName>;
    return (
      [
        getFontWeight(fonts.kanji.style),
        getFontWeight(fonts.kana.style),
        getFontWeight(fonts.yakumono.style),
        getFontWeight(fonts.number.style),
        getFontWeight(fonts.normal.style),
      ].reduce((a, b) => a + b, 0) / 5
    );
  }
  return 400;
};

// biome-ignore lint:style/useImportType
export const StylesTab = ({ styles }: any) => {
  return (
    <div style={{ padding: '8px 0' }}>
      {styles.length === 0 && (
        <Container space="medium">
          <VerticalSpace space="small" />
          <Text>
            <Muted>There is no styles</Muted>
          </Text>
        </Container>
      )}
      {/* biome-ignore lint:suspicious/noExplicitAny */}
      {styles.map((style: any, index: number) => {
        const familyText = readableText(style);
        return (
          <div
            key={`${style.name} - ${familyText}`}
            title={`${style.name} - ${familyText}`}
            className={cssStyles.row}
            onClick={() => {
              console.log('ciicked', style);
              emit<ApplyHandler>('APPLY', {
                fonts: style.fonts,
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
                <IconTrash32 />
              </IconButton>
            </div>
          </div>
        );
      })}
    </div>
  );
};
