import { Tabs, type TabsOption, render } from '@create-figma-plugin/ui';
import { on } from '@create-figma-plugin/utilities';
/* biome-ignore lint:style/useImportType */
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { StylesTab } from './tabs/styles';
import { TextTab } from './tabs/text';
import type {
  SelectionChangeHandler,
  Settings,
  Style,
  StylesChangeHandler,
} from './types';
import '!./global.css';

export type UIProps = {
  families: string[];
  familyStyles: Record<string, string[]>;
  editable: boolean;
  settings: Settings;
  styles: Style[];
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
      children: (
        <TextTab
          families={families}
          familyStyles={familyStyles}
          editable={editable}
          settings={settings}
        />
      ),
      value: 'Text',
    },
    {
      children: <StylesTab styles={styles} />,
      value: 'Styles(Beta)',
    },
  ];

  const [tab, setTab] = useState<string>(tabOptions[0].value);
  const handleTabChange = (event: h.JSX.TargetedEvent<HTMLInputElement>) => {
    // biome-ignore lint:style/useTypeCasting
    const newValue = event.currentTarget.value as any;
    setTab(newValue);
  };
  return <Tabs options={tabOptions} value={tab} onChange={handleTabChange} />;
};

export default render(App);
