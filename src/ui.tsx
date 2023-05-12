import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { on } from '@create-figma-plugin/utilities';
import { render, Tabs, TabsOption } from '@create-figma-plugin/ui';
import { Settings, SelectionChangeHandler, StylesChangeHandler, Style } from './types';
import { TextTab } from './tabs/text';
import { StylesTab } from './tabs/styles';

export type UIProps = {
  families: string[];
  familyStyles: Record<string, string[]>;
  editable: boolean;
  settings: Settings;
  styles: Style[]
};

const App = ({
  families,
  familyStyles,
  editable: initialEditable,
  settings,
  styles: initialStyles,
}: UIProps) => {
  const [editable, setEditable] = useState<boolean>(initialEditable);
  const [styles, setStyles] = useState<Style[]>(initialStyles);

  useEffect(() => {
    on<SelectionChangeHandler>('SELECTION_CHANGE', (nextEditable) => {
      setEditable(nextEditable);
    });

    on<StylesChangeHandler>('STYLES_CHANGE', (nextStyles) => {
      setStyles(nextStyles);
    });
  }, []);

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
  return <Tabs options={tabOptions} value={tab} onChange={handleTabChange} />
};

export default render(App);
