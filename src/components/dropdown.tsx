import { h, JSX } from "preact"
import { useEffect, useMemo, useState } from "preact/hooks"
import { Dropdown, DropdownOption } from "@create-figma-plugin/ui"

export const MyDropdown = function (props: {
  options: string[]
  onChange(option: string): void
}) {
  const [value, setValue] = useState<string>('Regular')

  useEffect(() => {
    if (!props.options.includes(value)) {
      setValue(props.options[0])
    }
  }, props.options)

  const options: DropdownOption[] = useMemo(() => {
    return props.options.map(option => {
      return { value: option }
    })
  }, [props.options])

  const handleChange = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value
    console.log(newValue)
    setValue(newValue)
    props.onChange(newValue)
  }

  if (!props.options.includes(value)) {
    return <Dropdown disabled value={null} options={[{ value: undefined }]} />
  }
  console.log(options)
  return <Dropdown onChange={handleChange} options={options} value={value} />
}