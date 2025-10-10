interface TableProps {
  columns: string[];
  data: any[];
}

export default function Table({ columns, data }: TableProps) {
  return (
    <table className="min-w-full bg-gray-800 rounded overflow-hidden">
      <thead className="bg-gray-700">
        <tr>
          {columns.map((col) => (
            <th key={col} className="text-left p-2">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id} className="hover:bg-gray-700 cursor-pointer">
            {columns.map((col) => (
              <td key={col} className="p-2">{row[col.toLowerCase()]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
