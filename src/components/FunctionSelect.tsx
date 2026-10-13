type FunctionOption = {
  id: string
  label: string
}

type FunctionSelectProps = {
  value: string
  options: FunctionOption[]
  onChange: (id: string) => void
  label?: string
}

export function FunctionSelect({
  value,
  options,
  onChange,
  label = 'f(x)',
}: FunctionSelectProps) {
  return (
    <label className="fn-select">
      <span>{label} =</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
