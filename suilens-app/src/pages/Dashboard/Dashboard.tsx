import React, { useState, useEffect } from "react";
import { useTable, Column, HeaderGroup } from "react-table";
import { Bar, Pie, Line } from "react-chartjs-2";
import { getSqlQueryResults } from "../../common/api.services";
import "./Dashboard.scss";

type RowData = Record<string, any>;

type QueryHistoryItem = {
  id: number;
  query: string;
  timestamp: Date;
};

type ChartType = "bar" | "pie" | "line" | null;

const App: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [data, setData] = useState<RowData[]>([]);
  const [columns, setColumns] = useState<Column<RowData>[]>([]);
  const [history, setHistory] = useState<QueryHistoryItem[]>([]);
  const [chartType, setChartType] = useState<ChartType>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [availableChartTypes, setAvailableChartTypes] = useState<ChartType[]>([]);

  useEffect(() => {
    if (data.length > 0 && columns.length > 0) {
      analyzeDataForCharts();
    }
  }, [data, columns]);

  const analyzeDataForCharts = () => {
    const numericColumns = columns.filter(col => {
      if (typeof col.accessor !== 'string') return false;
      return data.some(row => {
        const value = row[col.accessor as string];
        return !isNaN(parseFloat(value)) && isFinite(value);
      });
    });

    const newAvailableChartTypes: ChartType[] = [];
    
    if (numericColumns.length >= 1) {
      newAvailableChartTypes.push("bar", "line");
    }
    
    if (numericColumns.length === 1) {
      newAvailableChartTypes.push("pie");
    }

    setAvailableChartTypes(newAvailableChartTypes);

    if (numericColumns.length > 0) {
      const firstNumericCol = numericColumns[0].accessor as string;
      const labels = data.map((_, index) => `Row ${index + 1}`);
      
      setChartData({
        labels,
        datasets: [{
          label: firstNumericCol,
          data: data.map(row => parseFloat(row[firstNumericCol])),
          backgroundColor: '#2d5f8b',
          borderColor: '#2d5f8b',
          borderWidth: 1
        }]
      });
      
      if (newAvailableChartTypes.length > 0) {
        setChartType(newAvailableChartTypes[0]);
      }
    }
  };

  const fetchData = async () => {

    //TODO - uncomment once we implemented it
    // const aiResponse = await axios.post<{ sql: string }>("/api/convert", { text: query });
    // const sql = aiResponse.data.sql;

    //TODO - uncomment once we implemented it
    //   const chartSuggestion = await axios.post<ChartSuggestion>("/api/chart", { data: rows });
    //   setChartType(chartSuggestion.data.type);
    //   setChartData(chartSuggestion.data.chartData);
  
    const newHistoryItem: QueryHistoryItem = {
      id: history.length + 1,
      query,
      timestamp: new Date(),
    };
    setHistory([...history, newHistoryItem]);

    const dbResponse = await getSqlQueryResults({ 
      query, 
      module: localStorage.getItem('module') as string 
    });
    const rows = dbResponse;

    if (rows.length > 0) {
      const cols: Column<RowData>[] = Object.keys(rows[0]).map(key => ({
        Header: key,
        accessor: key,
      }));
      setColumns(cols);
      setData(rows);
    }
  };

  const tableInstance = useTable({ columns, data });

  const renderHistoryItem = (item: QueryHistoryItem) => {
    return (
      <div key={item.id} className="history-item" onClick={() => setQuery(item.query)}>
        <div className="history-header">
          <span className="history-id">#{item.id}</span>
          <span className="history-time">
            {item.timestamp.toLocaleTimeString()}
          </span>
        </div>
        <div className="history-query">
          {item.query}
        </div>
        <div className="history-divider"></div>
      </div>
    );
  };

  const renderChart = () => {
    if (!chartType || !chartData) {
      return (
        <div className="empty-chart">
          <p>No chart data available. Run a query with numeric data to see visualizations.</p>
        </div>
      );
    }

    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Query Result Visualization',
        },
      },
    };

    switch (chartType) {
      case 'bar':
        return <Bar data={chartData} options={commonOptions} />;
      case 'pie':
        return <Pie data={chartData} options={commonOptions} />;
      case 'line':
        return <Line data={chartData} options={commonOptions} />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="left-panel">
        <div className="panel-header">
          <h2>Query History</h2>
        </div>
        <div className="history-list">
          {history.map(renderHistoryItem)}
        </div>
      </div>

      <div className="right-panel">
        {/* Query Editor Section (Top) */}
        <div className="query-section">
          <div className="query-header">
            <h3>Query Editor</h3>
            <button onClick={fetchData} className="run-button">
              Run
            </button>
          </div>
          <textarea
            className="query-input"
            placeholder="Enter your SQL query here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={6}
          />
        </div>

        {/* Results Section (Bottom) - Split View */}
        <div className="results-section">
          {/* Table Panel (Left) */}
          <div className="table-panel">
            <div className="panel-header">
              <h3>Query Results</h3>
              {data.length > 0 && (
                <span className="row-count">{data.length} rows</span>
              )}
            </div>
            <div className="table-container">
              {data.length > 0 ? (
                <table {...tableInstance.getTableProps()} className="data-table">
                  <thead>
                    {tableInstance.headerGroups.map((headerGroup: HeaderGroup) => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          <th {...column.getHeaderProps()} className="table-header">
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
                            <td {...cell.getCellProps()} className="table-cell">
                              {cell.render("Cell")}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="empty-table">
                  <p>No data to display. Run a query to see results.</p>
                </div>
              )}
            </div>
          </div>

          {/* Chart Panel (Right) */}
          <div className="chart-panel">
            <div className="panel-header">
              <h3>Visualization</h3>
              {availableChartTypes.length > 0 && (
                <div className="chart-type-selector">
                  {availableChartTypes.map(type => (
                    <button
                      key={type}
                      className={`chart-type-btn ${chartType === type ? 'active' : ''}`}
                      onClick={() => setChartType(type)}
                    >
                      text
                      {/* #TODO - resolve this issue */}
                      {/* {type.charAt(0).toUpperCase() + type.slice(1)} */}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="chart-container">
              {/* #TODO - resolve this issue */}
              {/* {renderChart()} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;