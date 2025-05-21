import { h, JSX } from 'preact';
import { useEffect, useMemo } from 'preact/hooks';
import { Dropdown, DropdownOption } from '@create-figma-plugin/ui';

export const MyDropdown = function (props: {
  options: string[];
  value: string;
  onChange(option: string): void;
}) {
  useEffect(() => {
    if (!props.options.includes(props.value)) {
      props.onChange(props.options[0]);
    }
  }, props.options);

  const options: DropdownOption[] = useMemo(() => {
    return props.options.map((option) => {
      return { value: option };
    });
  }, [props.options]);

  const handleChange = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value;
    props.onChange(newValue);
  };

  if (!props.options.includes(props.value)) {
    return <Dropdown disabled value={null} options={[]} />;
  }
  return (
    <Dropdown onChange={handleChange} options={options} value={props.value} />
  );
};
