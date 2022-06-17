import { Fragment, h } from 'preact'
import { useState, useEffect, StateUpdater } from 'preact/hooks'
import { emit, on } from "@create-figma-plugin/utilities"
import { Button, Container, Divider, render, VerticalSpace, Text, Bold } from '@create-figma-plugin/ui'
import { FilterInput } from './components/filter-input';
import { MyDropdown } from './components/dropdown';
import { Checkbox } from './components/checkbox';

type Props = {
  families: string[],
  styles: Record<string, string[]>
  editable: boolean
}

const defaultFonts: Record<'ja' | 'en', FontName> = {
  ja: {
    family: "Noto Sans JP",
    style: "Medium"
  },
  en: {
    family: "Inter",
    style: "Medium",
  }
}

const Heading = (props: {
  children: string
}) => {
  return <Fragment>
    <VerticalSpace space="large" />
    <Container space='medium'>
      <Text><Bold>{props.children}</Bold></Text>
    </Container>
    <VerticalSpace space="small" />
  </Fragment>
}

const FontSelector = (props: {
  category: Category
  fontName: FontName
  onChange: StateUpdater<Fonts>
  familyOptions: string[]
  styleOptions: string[]
}) => {
  const { category, fontName, onChange, familyOptions, styleOptions } = props
  const { family, style } = fontName

  const onChangeFaimly = (next: string) => {
    onChange(prev => ({ ...prev, [category]: { ...prev[category], family: next } }))
  }
  const onChangeStyle = (next: string) => {
    onChange(prev => ({ ...prev, [category]: { ...prev[category], style: next } }))
  }

  return <Container space='extraSmall' style={{ display: 'flex' }}>
    <div style={{ minWidth: '60%' }}>
      <FilterInput options={familyOptions} initialValue={family} onChange={onChangeFaimly} />
    </div>
    <MyDropdown options={styleOptions} value={style} onChange={onChangeStyle} />
  </Container>
}

type Category = 'japanese' | 'kanji' | 'kana' | 'yakumono' | 'number' | 'default'
type FontName = { family: string, style: string }
type Fonts = Record<Category, FontName>

const App = ({ families, styles, editable: initialEditable }: Props) => {
  const [editable, setEditable] = useState<boolean>(initialEditable);
  const [isDetail, setDetail] = useState(false)

  const [fonts, setFonts] = useState<Fonts>({
    japanese: defaultFonts.ja,
    kanji: defaultFonts.ja,
    kana: defaultFonts.ja,
    yakumono: defaultFonts.ja,
    number: defaultFonts.en,
    default: defaultFonts.en,
  })

  const apply = () => {
    const { japanese, kanji, kana, yakumono, number, default: normal } = fonts
    const data = isDetail ? { kanji, kana, yakumono, number, normal } : { japanese, normal }
    emit("apply", {
      fonts: data
    })
  }

  useEffect(() => {
    on("selectionchange", (data) => {
      setEditable(data.editable)
    })
  })

  return (
    <Fragment>
      {isDetail ?
        <Fragment key='more'>
          <Heading>Japanese Kanji</Heading>
          <FontSelector
            category='kanji'
            fontName={fonts.kanji}
            onChange={setFonts}
            familyOptions={families}
            styleOptions={styles[fonts.kanji.family] ?? []}
          />
          <Heading>Japanese Kana</Heading>
          <FontSelector
            category='kana'
            fontName={fonts.kana}
            onChange={setFonts}
            familyOptions={families}
            styleOptions={styles[fonts.kana.family] ?? []}
          />
          <Heading>Japanese Yakumono</Heading>
          <FontSelector
            category='yakumono'
            fontName={fonts.yakumono}
            onChange={setFonts}
            familyOptions={families}
            styleOptions={styles[fonts.yakumono.family] ?? []}
          />
          <Heading>Number</Heading>
          <FontSelector
            category='number'
            fontName={fonts.number}
            onChange={setFonts}
            familyOptions={families}
            styleOptions={styles[fonts.number.family] ?? []}
          />
          <Heading>Default</Heading>
          <FontSelector
            category='default'
            fontName={fonts.default}
            onChange={setFonts}
            familyOptions={families}
            styleOptions={styles[fonts.default.family] ?? []}
          />
        </Fragment>
        :
        <Fragment key='simple'>
          <Heading>Japanese</Heading>
          <FontSelector
            category='japanese'
            fontName={fonts.japanese}
            onChange={setFonts}
            familyOptions={families}
            styleOptions={styles[fonts.japanese.family] ?? []}
          />
          <Heading>Default</Heading>
          <FontSelector
            category='default'
            fontName={fonts.default}
            onChange={setFonts}
            familyOptions={families}
            styleOptions={styles[fonts.default.family] ?? []}
          />
        </Fragment>
      }
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, }}>
        <Divider />
        <div style={{ padding: 8, display: 'flex', alignItems: 'center', width: '100%' }}>
          <div style={{ marginLeft: 4, marginRight: 'auto' }}>
            <Checkbox value={isDetail} onChange={(val) => { setDetail(val) }} label={"Detail settings"} />
          </div>
          <Button disabled={!editable} onClick={apply}>Apply</Button>
        </div>
      </div>
    </Fragment>
  );
};

export default render(App)

