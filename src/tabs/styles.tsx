import { h } from 'preact';
import { emit } from '@create-figma-plugin/utilities';
import { IconTrash32, IconButton, Container, VerticalSpace, Text, Muted } from '@create-figma-plugin/ui';
import { AdvancedCategory, ApplyHandler, DeleteStyleHandler, SimpleCategory, Style } from '../types';
import cssStyles from './styles.module.css'

const readableText = (style: Style) => {
  const { fonts: _fonts, fontMode } = style;
  if (fontMode === 'simple') {
    const fonts = _fonts as Record<SimpleCategory, FontName>;
    return [
      fonts['japanese'].family + ' ' + fonts['japanese'].style,
      fonts['normal'].family + ' ' + fonts['normal'].style
    ].filter((v, i, a) => a.indexOf(v) === i).join(', ')
  } else if (fontMode === 'advanced') {
    const fonts = _fonts as Record<AdvancedCategory, FontName>;
    return [
      fonts['kanji'].family,
      fonts['kana'].family,
      fonts['yakumono'].family,
      fonts['number'].family,
      fonts['normal'].family,
    ].filter((v, i, a) => a.indexOf(v) === i).join(', ')
  }
}

export const StylesTab = ({ styles }: any) => {
  return (
    <div style={{ padding: '8px 0' }}>
      {styles.length === 0 && <Container space='medium'>
        <VerticalSpace space='small' />
        <Text><Muted>There is no styles</Muted></Text>
      </Container>}
      {styles.map((style: any, index: number) => {
        const familyText = readableText(style);
        return <div
          title={`${style.name} - ${familyText}`}
          className={cssStyles.row}
          onClick={() => {
            console.log('ciicked', style)
            emit<ApplyHandler>('APPLY', {
              fonts: style.fonts,
              fontMode: style.fontMode,
            });
          }}
        >
          <span className={cssStyles.name}>{style.name}
            <span style={{ marginLeft: 4, opacity: 0.6 }}>- {familyText}</span>
          </span>
          <div className={cssStyles.deleteButton}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                emit<DeleteStyleHandler>('DELETE_STYLE', index);
              }}>
            <IconTrash32 />
          </IconButton>
          </div>
        </div>
      })}
    </div>
  );
};