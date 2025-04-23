import React, { useState } from "react";
import { useTable, Column, HeaderGroup } from "react-table";
import { Bar, Pie, Line } from "react-chartjs-2";
import { getSqlQueryResults } from "../../common/api.services";

type RowData = Record<string, any>;

type ChartSuggestion = {
  type: "bar" | "pie" | "line";
  chartData: any;
};

const App: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [data, setData] = useState<RowData[]>([]);
  const [columns, setColumns] = useState<Column<RowData>[]>([]);
  const [chartType, setChartType] = useState<ChartSuggestion["type"] | null>(null);
  const [chartData, setChartData] = useState<any>(null);

  const fetchData = async () => {
    //TODO - uncomment once we implemented it
    // const aiResponse = await axios.post<{ sql: string }>("/api/convert", { text: query });
    // const sql = aiResponse.data.sql;
    console.log('--module---', localStorage.getItem('module'))
    const dbResponse = await await getSqlQueryResults({ query, module: localStorage.getItem('module') as string });
    const rows = dbResponse;

    if (rows.length > 0) {
      const cols: Column<RowData>[] = Object.keys(rows[0]).map(key => ({
        Header: key,
        accessor: key,
      }));
      setColumns(cols);
      setData(rows);

    //   const chartSuggestion = await axios.post<ChartSuggestion>("/api/chart", { data: rows });
    //   setChartType(chartSuggestion.data.type);
    //   setChartData(chartSuggestion.data.chartData);
    }
  };

  const tableInstance = useTable({ columns, data });

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Smart SQL & Charts</h1>
      <input
        type="text"
        className="border p-2 w-full mb-4"
        placeholder="Ask your data..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={fetchData} className="bg-blue-500 text-white px-4 py-2 mb-4 rounded">
        Run
      </button>

      {data.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table {...tableInstance.getTableProps()} className="min-w-full border">
              <thead>
                {tableInstance.headerGroups.map((headerGroup: HeaderGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()} className="border p-2">
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...tableInstance.getTableBodyProps()}>
                {tableInstance.rows.map((row) => {
                  tableInstance.prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()} className="border p-2">
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-6">
            {chartType === "bar" && <Bar data={chartData} />}
            {chartType === "pie" && <Pie data={chartData} />}
            {chartType === "line" && <Line data={chartData} />}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
