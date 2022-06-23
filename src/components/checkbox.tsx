import { h } from 'preact';
import { Checkbox as UICheckbox, Text } from '@create-figma-plugin/ui';

export const Checkbox = (
  props: {
    value: boolean;
    onChange(value: boolean): void;
    label: string;
  },
) => {
  const { value, onChange, label } = props;
  const handleValueChange = (newValue: boolean) => {
    onChange(newValue);
  };
  return (
    <UICheckbox onValueChange={handleValueChange} value={value}>
      <Text>{label}</Text>
    </UICheckbox>
  );
};
