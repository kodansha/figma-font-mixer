import { h } from 'preact'
import { useState, useEffect, useMemo } from 'preact/hooks'
import { emit, on } from "@create-figma-plugin/utilities"
import { Button, Container, render, VerticalSpace } from '@create-figma-plugin/ui'
import { FilterInput } from './components/filter-input';

type Props = {
  families: string[],
  styles: Record<string, string[]>
  editable: boolean
}

const App = ({ families, styles, editable: initialEditable }: Props) => {
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [selectedFamily2, setSelectedFamily2] = useState<string | null>(null);
  const [editable, setEditable] = useState<boolean>(initialEditable);

  const apply = () => {
    emit("apply", {
      fonts: [{
        family: selectedFamily,
        style: styles[selectedFamily][0]
      }, {
          family: selectedFamily2,
          style: styles[selectedFamily2][0]
        }]
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
      {styles && selectedFamily && (
        <p>{styles[selectedFamily]}</p>
      )}
      <h4>English</h4>
      <FilterInput options={families} onChange={(newValue) => setSelectedFamily2(newValue)} />
      {styles && selectedFamily2 && (
        <p>{styles[selectedFamily2]}</p>
      )}
      <div style={{ position: 'absolute', bottom: 16, right: 16 }}>
        <Button disabled={!editable} onClick={apply}>Apply</Button>
      </div>
    </Container>
  );
};

export default render(App)

