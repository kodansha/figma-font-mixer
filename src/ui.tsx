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
      { pluginMessage: { type: "apply", family: selectedFamily, style: data.styles[selectedFamily][0] } },
      "*"
    );
  }

  return (
    <div>
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
      <button onClick={apply}>Apply</button>
    </div>
  );
};

const root = createRoot(document.getElementById("app"));
root.render(<App />);

