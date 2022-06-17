import { h, JSX } from "preact"
import { useMemo, useState } from "preact/hooks"
import { TextboxAutocomplete, TextboxAutocompleteOption } from "@create-figma-plugin/ui"

export const FilterInput = ({
  options: rawOptions,
  initialValue,
  onChange,
}: {
    options: string[];
    initialValue: string;
    onChange(option: string): void;
  }) => {
  const [value, setValue] = useState(initialValue)
  const options: TextboxAutocompleteOption[] = useMemo(() => {
    return rawOptions.map(family => {
      return { value: family }
    })
  }, [rawOptions])
  function handleInput(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    console.log(newValue)
    setValue(newValue)
    rawOptions.includes(newValue) && onChange(newValue)
  }
  return (
    <TextboxAutocomplete
      filter
      onInput={handleInput}
      options={options}
      value={value}
    />
  )
}
