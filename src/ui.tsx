import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import { on } from "@create-figma-plugin/utilities"
import { render } from '@create-figma-plugin/ui'

const App = (props) => {
  const [data, setData] = useState<{
    families: string[],
    styles: Record<string, string[]>
  }>({
    families: [],
    styles: {}
  });
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [selectedFamily2, setSelectedFamily2] = useState<string | null>(null);

  useEffect(() => {
    on("LOAD_FONTS", (res) => {
      const { families, styles } = res
      setData({ families, styles })
    })
  }, []);

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

  if (data.families.length === 0) return <div>LOading</div>

  return (
    <div>
      <h4>日本語</h4>
      <select autoComplete="on" value={selectedFamily} onChange={e => {
        // setSelectedFamily(e.target.value);
      }}>
        {data.families.map((family) => (
          <option key={family}>{family}</option>
        ))}
      </select>
      {data.styles && selectedFamily && (
        <p>{data.styles[selectedFamily]}</p>
      )}
      <h4>英語</h4>
      <select autoComplete="on" value={selectedFamily2} onChange={e => {
        // setSelectedFamily2(e.target.value);
      }}>
        {data.families.map((family) => (
          <option key={family}>{family}</option>
        ))}
      </select>
      {data.styles && selectedFamily2 && (
        <p>{data.styles[selectedFamily2]}</p>
      )}
      <button onClick={apply}>Apply</button>
    </div>
  );
};

export default render(App)

