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

export const TextTab = ({
  families,
  familyStyles,
  editable: initialEditable,
  settings,
}: UIProps) => {
  const [editable, setEditable] = useState<boolean>(initialEditable);
  const [mode, updateMode] = useState<"simple" | "advanced">(settings.fontMode)
  const [fonts, setFonts] = useState<Fonts>(settings.fonts);

  const apply = () => {
    emit<ApplyHandler>('APPLY', {
      fonts,
      fontMode: mode,
      saveSettings: true
    });
  };

  useEffect(() => {
    on<SelectionChangeHandler>('SELECTION_CHANGE', (nextEditable) => {
      setEditable(nextEditable);
    });
  }, []);

  const categories = mode === 'advanced' ? [
    'kanji', 'kana', 'yakumono', 'number', 'normal',
  ] as const : ['japanese', 'normal'] as const;

  const [isOpen, setOpen] = useState(false)
  const [name, setName] = useState('')

  return (
    <Fragment>
      <Modal
        open={isOpen}
        onCloseButtonClick={() => setOpen(false)}
        onOverlayClick={() => setOpen(false)}
        title="Create new text style"
      >
        <Container space="small" style={{ width: 240 }}>
          <VerticalSpace space="small" />
          <form style={{ margin: 0 }} onSubmit={(e) => {
            // ここでemit
            emit<SaveStyleHandler>('SAVE_STYLE', {
              name,
              fonts,
              fontMode: mode
            })
            setOpen(false)
            setName('')
            e.preventDefault();
          }}>
            <Textbox placeholder='Style name' onInput={(e: h.JSX.TargetedEvent) => {
              const newValue = (e.currentTarget as any).value
              setName(newValue)
            }} value={name} variant="border" />
            <VerticalSpace space="extraSmall" />
            <Button type='submit'>Save styles</Button>
          </form>
          <VerticalSpace space="small" />
        </Container>
      </Modal>
      <IconButton title="Create text style" style={{
        position: 'fixed',
        right: 8,
        top: 5,
        zIndex: 1,
      }} onClick={() => {
        const name = ''
        console.log({ name, mode, fonts })
        setOpen(true)
        }}>
        <IconPlus32 />
      </IconButton>
      <div style={{ paddingBottom: 48 + 16 }}>
        {categories.map((category) => {
          // console.log({ category, fonts: fonts[category] })
          return (
            <Fragment key={category}>
              <Heading>{labels[category]}</Heading>
              <FontSelector
                category={category}
                fontName={fonts[category]}
                onChange={setFonts}
                familyOptions={families}
                styleOptions={familyStyles[fonts[category].family] ?? []}
              />
            </Fragment>
          );
        })}
      </div>
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          left: 0,
          zIndex: 1,
          backgroundColor: 'var(--figma-color-bg)',
        }}
      >
        <Divider />
        <div
          style={{
            padding: 8,
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div style={{ marginLeft: 4, marginRight: 'auto' }}>
            <Checkbox
              value={mode === 'advanced'}
              onChange={(val) => {
                updateMode(val ? 'advanced' : 'simple')
              }}
              label={'Detail settings'}
            />
          </div>
          <Button disabled={!editable} onClick={apply}>Apply</Button>
        </div>
      </div>
    </Fragment>
  );
};