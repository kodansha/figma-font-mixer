import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import { emit, on } from "@create-figma-plugin/utilities"
import { Button, Container, render, VerticalSpace } from '@create-figma-plugin/ui'
import { FilterInput } from './components/filter-input';
import { MyDropdown } from './components/dropdown';

type Props = {
  families: string[],
  styles: Record<string, string[]>
  editable: boolean
}

const App = ({ families, styles, editable: initialEditable }: Props) => {
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedFamily2, setSelectedFamily2] = useState<string | null>(null);
  const [selectedStyle2, setSelectedStyle2] = useState<string | null>(null);
  const [editable, setEditable] = useState<boolean>(initialEditable);

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
    <Container space='medium'>
      <VerticalSpace space="extraSmall" />
      <h4>Japanese</h4>
      <FilterInput options={families} onChange={(newValue) => setSelectedFamily(newValue)} />
      <MyDropdown options={styles[selectedFamily] ?? []} onChange={(newValue) => setSelectedStyle(newValue)} />
      <h4>English</h4>
      <FilterInput options={families} onChange={(newValue) => setSelectedFamily2(newValue)} />
      <MyDropdown options={styles[selectedFamily2] ?? []} onChange={(newValue) => setSelectedStyle2(newValue)} />
      <div style={{ position: 'absolute', bottom: 16, right: 16 }}>
        <Button disabled={!editable} onClick={apply}>Apply</Button>
      </div>
    </Container>
  );
};

export default render(App)

