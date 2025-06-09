import {
  TextboxAutocomplete,
  type TextboxAutocompleteOption,
} from '@create-figma-plugin/ui';
import { type JSX, h } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import styles from './filter-input.css';

export const FilterInput = ({
  options: rawOptions,
  initialValue,
  onChange,
}: {
  options: string[];
  initialValue: string;
  onChange(option: string): void;
}) => {
  const [value, setValue] = useState(initialValue);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const options: TextboxAutocompleteOption[] = useMemo(() => {
    return rawOptions.map((family) => {
      return { value: family };
    });
  }, [rawOptions]);
  function handleInput(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value;
    setValue(newValue);
    rawOptions.includes(newValue) && onChange(newValue);
  }
  let isTop = false;
  if (ref) {
    const rects = ref.getClientRects();
    const { top, height } = rects[0];
    const y = top + height / 2;
    isTop = window.innerHeight - y * 2 < 0;
  }
  return (
    <div ref={setRef} className={styles.input}>
      <TextboxAutocomplete
        top={isTop}
        filter
        onInput={handleInput}
        options={options}
        value={value}
      />
    </div>
  );
};
