import { h, JSX } from "preact"
import { useMemo, useState } from "preact/hooks"
import { TextboxAutocomplete, TextboxAutocompleteOption } from "@create-figma-plugin/ui"

export const FilterInput = ({
  options: rawOptions,
  initialValue,
  onChange,
  top
}: {
    options: string[];
    initialValue: string;
    onChange(option: string): void;
    top?: boolean
  }) => {
  const [value, setValue] = useState(initialValue)
  const options: TextboxAutocompleteOption[] = useMemo(() => {
    return rawOptions.map(family => {
      return { value: family }
    })
  }, [rawOptions])
  function handleInput(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    setValue(newValue)
    rawOptions.includes(newValue) && onChange(newValue)
  }
  return (
    <TextboxAutocomplete
      top={top}
      filter
      onInput={handleInput}
      options={options}
      value={value}
    />
  )
}
