import { Text, Checkbox as UICheckbox } from '@create-figma-plugin/ui';
import { h } from 'preact';

export const Checkbox = (props: {
  value: boolean;
  onChange(value: boolean): void;
  label: string;
}) => {
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
