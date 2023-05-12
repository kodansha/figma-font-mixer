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
  Tabs,
  TabsOption,
} from '@create-figma-plugin/ui';
import { FilterInput } from './components/filter-input';
import { MyDropdown } from './components/dropdown';
import { Checkbox } from './components/checkbox';
import {
  Fonts,
  Category,
  Settings,
  ApplyHandler,
  SelectionChangeHandler,
  StylesChangeHandler,
  Style,
} from './types';
import { TextTab } from './tabs/text';
import { StylesTab } from './tabs/styles';

export type UIProps = {
  families: string[];
  familyStyles: Record<string, string[]>;
  editable: boolean;
  settings: Settings;
  styles: any[]
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

const App = ({
  families,
  familyStyles,
  editable: initialEditable,
  settings,
  styles: initialStyles,
}: UIProps) => {
  const [editable, setEditable] = useState<boolean>(initialEditable);
  const [mode, updateMode] = useState<"simple" | "advanced">(settings.fontMode)
  const [fonts, setFonts] = useState<Fonts>(settings.fonts);
  const [styles, setStyles] = useState<Style[]>(initialStyles);

  const apply = () => {
    emit<ApplyHandler>('APPLY', {
      fonts,
      fontMode: mode
    });
  };

  useEffect(() => {
    on<SelectionChangeHandler>('SELECTION_CHANGE', (nextEditable) => {
      setEditable(nextEditable);
    });

    on<StylesChangeHandler>('STYLES_CHANGE', (nextStyles) => {
      setStyles(nextStyles);
    });
  }, []);

  const categories = mode === 'advanced' ? [
    'kanji', 'kana', 'yakumono', 'number', 'normal',
  ] as const : ['japanese', 'normal'] as const;

  const tabOptions: TabsOption[] = [
    {
      children: <TextTab
        families={families}
        familyStyles={familyStyles}
        editable={editable}
        settings={settings}
      />, value: 'Text'
    },
    {
      children: <StylesTab styles={styles} />, value: 'Styles'
    }
  ]

  const [tab, setTab] = useState<string>(tabOptions[0].value)
  const handleTabChange = (event: h.JSX.TargetedEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value as any
    setTab(newValue)
  }
  console.log(styles)
  return <Tabs options={tabOptions} value={tab} onChange={handleTabChange} />
};

export default render(App);
