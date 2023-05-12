import { Fragment, h } from 'preact';
import { useState, useEffect, StateUpdater } from 'preact/hooks';
import { emit, on } from '@create-figma-plugin/utilities';
import {
  Button,
  Container,
  Divider,
  render,
  VerticalSpace,
  Text,
  Bold,
  IconPlus32,
  Modal,
  Textbox,
  IconTrash32,
  IconButton,
} from '@create-figma-plugin/ui';
import { FilterInput } from '../components/filter-input';
import { MyDropdown } from '../components/dropdown';
import { Checkbox } from '../components/checkbox';
import {
  Fonts,
  Category,
  Settings,
  ApplyHandler,
  SelectionChangeHandler,
  SaveStyleHandler,
  DeleteStyleHandler,
} from '../types';

export type UIProps = {
  families: string[];
  familyStyles: Record<string, string[]>;
  editable: boolean;
  settings: Settings;
};

const Heading = (props: {
  children: string;
}) => {
  return (
    <Fragment>
      <VerticalSpace space="large" />
      <Container space='medium'>
        <Text><Bold>{props.children}</Bold></Text>
      </Container>
      <VerticalSpace space="small" />
    </Fragment>
  );
};

const FontSelector = (props: {
  category: Category;
  fontName: FontName;
  onChange: StateUpdater<Fonts>;
  familyOptions: string[];
  styleOptions: string[];
  top?: boolean;
}) => {
  const { category, fontName, onChange, familyOptions, styleOptions } = props;
  const { family, style } = fontName;

  const onChangeFaimly = (next: string) => {
    onChange(
      (prev) => ({ ...prev, [category]: { ...prev[category], family: next } }),
    );
  };
  const onChangeStyle = (next: string) => {
    onChange(
      (prev) => ({ ...prev, [category]: { ...prev[category], style: next } }),
    );
  };

  return (
    <Container space='extraSmall' style={{ display: 'flex' }}>
      <div style={{ minWidth: '60%' }}>
        <FilterInput
          options={familyOptions}
          initialValue={family}
          onChange={onChangeFaimly}
        />
      </div>
      <MyDropdown
        options={styleOptions}
        value={style}
        onChange={onChangeStyle}
      />
    </Container>
  );
};

const labels: Record<Category, string> = {
  japanese: 'Japanese',
  kanji: 'Japanese Kanji',
  kana: 'Japanese Hiragana',
  yakumono: 'Japanese Yakumono',
  number: 'Number',
  normal: 'Default',
};

export const StylesTab = ({ styles }: any) => {
  return (
    <Fragment>
      {styles.map((style: any, index: number) => {
        return <div onClick={() => {
          console.log('ciicked', style)
          emit<ApplyHandler>('APPLY', {
            fonts: style.fonts,
            fontMode: style.fontMode,
          });
        }}>
          {style.name}
          <small>{JSON.stringify(style.fonts, null, 2)}</small>
          <IconButton onClick={(e) => {
            e.stopPropagation();
            emit<DeleteStyleHandler>('DELETE_STYLE', index);
          }}>
            <IconTrash32 />
          </IconButton>
        </div>
      })}
    </Fragment>
  );
};