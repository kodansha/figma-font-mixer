import { Fragment, h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
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

const defaultFonts = {
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

const App = ({ families, styles, editable: initialEditable }: Props) => {
  const [selectedFamily, setSelectedFamily] = useState<string | null>(defaultFonts.ja.family);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(defaultFonts.ja.style);
  const [selectedFamily2, setSelectedFamily2] = useState<string | null>(defaultFonts.en.family);
  const [selectedStyle2, setSelectedStyle2] = useState<string | null>(defaultFonts.en.style);
  const [editable, setEditable] = useState<boolean>(initialEditable);
  const [isDetail, setDetail] = useState(false)

  const apply = () => {
    emit("apply", {
      fonts: [
        {
          family: selectedFamily,
          style: selectedStyle
        }, {
          family: selectedFamily2,
          style: selectedStyle2
        }
      ]
    })
  }

  useEffect(() => {
    on("selectionchange", (data) => {
      setEditable(data.editable)
    })
  })

  return (
    <Fragment>
      <Heading>Japanese</Heading>
      <Container space='extraSmall' style={{ display: 'flex' }}>
        <div style={{ minWidth: '60%' }}>
          <FilterInput options={families} initialValue={selectedFamily} onChange={(newValue) => setSelectedFamily(newValue)} />
        </div>
        <MyDropdown options={styles[selectedFamily] ?? []} value={selectedStyle} onChange={(newValue) => setSelectedStyle(newValue)} />
      </Container>
      <Heading>English</Heading>
      <Container space='extraSmall' style={{ display: 'flex' }}>
        <div style={{ minWidth: '60%' }}>
          <FilterInput options={families} initialValue={selectedFamily2} onChange={(newValue) => setSelectedFamily2(newValue)} />
        </div>
        <MyDropdown options={styles[selectedFamily2] ?? []} value={selectedStyle2} onChange={(newValue) => setSelectedStyle2(newValue)} />
      </Container>
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

