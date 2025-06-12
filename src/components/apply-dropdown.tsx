import { Dropdown, type DropdownOption } from '@create-figma-plugin/ui';
import { h, type JSX } from 'preact';
import { useMemo, useState } from 'preact/hooks';

export const ApplyDropdown = (props: {
  disabled?: boolean;
  onApplySelection(): void;
  onApplyPage(): void;
}) => {
  const { disabled = false, onApplySelection, onApplyPage } = props;
  const [value, setValue] = useState<string | null>(null);
  const options: DropdownOption[] = useMemo(
    () => [
      { value: 'selection', text: 'Apply to Selection' },
      { value: 'page', text: 'Apply to Page' },
    ],
    [],
  );
  const handleChange = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    const next = event.currentTarget.value;
    if (next === 'page') {
      onApplyPage();
    } else {
      onApplySelection();
    }
    setValue(null);
  };

  return (
    <Dropdown
      disabled={disabled}
      onChange={handleChange}
      options={options}
      placeholder="Apply"
      value={value}
    />
  );
};
