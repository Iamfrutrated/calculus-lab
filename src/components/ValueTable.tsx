type ValueTableProps = {
  rows: Array<{ x: string; y: string }>
  xHeader?: string
  yHeader?: string
}

export function ValueTable({
  rows,
  xHeader = 'x',
  yHeader = 'f(x)',
}: ValueTableProps) {
  return (
    <table className="value-table">
      <thead>
        <tr>
          <th>{xHeader}</th>
          <th>{yHeader}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={`${row.x}-${row.y}`}>
            <td>{row.x}</td>
            <td>{row.y}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
