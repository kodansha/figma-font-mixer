import { h } from 'preact'
import { useState, useEffect, useMemo } from 'preact/hooks'
import { on } from "@create-figma-plugin/utilities"
import { Button, Container, render } from '@create-figma-plugin/ui'
import { FilterInput } from './components/filter-input';

type Props = {
  families: string[],
  styles: Record<string, string[]>
}

const App = (props: Props) => {
  console.log(props)
  const [data, setData] = useState<{
    families: string[],
    styles: Record<string, string[]>
  }>({
    families: props.families,
    styles: props.styles
  });
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [selectedFamily2, setSelectedFamily2] = useState<string | null>(null);

  const apply = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "apply",
          fonts: [{
            family: selectedFamily,
            style: data.styles[selectedFamily][0]
          }, {
            family: selectedFamily2,
            style: data.styles[selectedFamily2][0]
          }]
        }
      },
      "*"
    );
  }

  return (
    <Container space='medium'>
      <div>
        <h4>日本語</h4>
        <FilterInput options={props.families} onChange={(newValue) => setSelectedFamily(newValue)} />
        {data.styles && selectedFamily && (
          <p>{data.styles[selectedFamily]}</p>
        )}
        <h4>英語</h4>
        <FilterInput options={props.families} onChange={(newValue) => setSelectedFamily2(newValue)} />
        {data.styles && selectedFamily2 && (
          <p>{data.styles[selectedFamily2]}</p>
        )}
        <Button onClick={apply}>Apply</Button>
      </div>
    </Container>
  );
};

export default render(App)

