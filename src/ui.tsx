import * as React from "react";
import { createRoot } from "react-dom/client";

const App = () => {
  const [data, setData] = React.useState<{
    families: string[],
    styles: Record<string, string[]>
  }>({
    families: [],
    styles: {}
  });
  const [selectedFamily, setSelectedFamily] = React.useState<string | null>(null);
  const [selectedFamily2, setSelectedFamily2] = React.useState<string | null>(null);

  React.useEffect(() => {
    window.onmessage = (e) => {
      const message = e.data.pluginMessage;
      if (message.type === "load-fonts") {
        console.log(message)
        setData(message.data);
      }
    };
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
      <h1>日本語</h1>
      <select autoComplete="on" value={selectedFamily} onChange={e => {
        setSelectedFamily(e.target.value);
      }}>
        {data.families.map((family) => (
          <option key={family}>{family}</option>
        ))}
      </select>
      {data.styles && selectedFamily && (
        <p>{data.styles[selectedFamily]}</p>
      )}
      <h1>英語</h1>
      <select autoComplete="on" value={selectedFamily2} onChange={e => {
        setSelectedFamily2(e.target.value);
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

const root = createRoot(document.getElementById("app"));
root.render(<App />);

