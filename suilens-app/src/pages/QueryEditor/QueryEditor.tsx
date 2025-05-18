import React, { useState, useEffect } from "react";
import { useTable, Column, HeaderGroup } from "react-table";
import { Bar, Pie, Line, } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { getDatabaseSchema, getSqlQueryResults } from "../../common/api.services";
import { TableSchema } from "../../common/types";
import SchemaStructure from "../../components/SchemaStructure/SchemaStructure";
import Loader from "../../components/Loader/Loader";
import "./QueryEditor.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

type RowData = Record<string, any>;
type QueryHistoryItem = { id: number; query: string; timestamp: Date; };
type ChartType = "bar" | "pie" | "line" | "tabular" | null;

const QueryEditor: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState<string>("");
  const [responseData, setResponseData] = useState('')
  const [sqlData, setSqlData] = useState<RowData[]>([]);
  const [columns, setColumns] = useState<Column<RowData>[]>([]);
  const [history, setHistory] = useState<QueryHistoryItem[]>([]);
  const [chartType, setChartType] = useState<ChartType>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [availableChartTypes, setAvailableChartTypes] = useState<ChartType[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sqlQuery, setSqlQuery] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [schema, setSchema] = useState<TableSchema[]>([]);
  const [activeTab, setActiveTab] = useState<'results' | 'console'>('results');

  const fetchSchema = async () => {
    try {
      const module = localStorage.getItem('module') as string
      const response = await getDatabaseSchema(module);
      setSchema(response);
    } catch (error) {
      console.error("Error fetching schema:", error);
    }
  };

  useEffect(() => {
    fetchSchema();
  }, []);

  useEffect(() => {
    if (sqlData.length > 0 && columns.length > 0) {
      analyzeDataForCharts();
    }
  }, [sqlData, columns]);

  const analyzeDataForCharts = () => {
    const numericColumns = columns.filter(col => {
      if (typeof col.accessor !== 'string') return false;
      return sqlData.some(row => {
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
      const labels = sqlData.map((_, index) => `Row ${index + 1}`);

      setChartData({
        labels,
        datasets: [{
          label: firstNumericCol,
          data: sqlData.map(row => parseFloat(row[firstNumericCol])),
          backgroundColor: '#374151',
          borderColor: '#111827',
          borderWidth: 1
        }]
      });

      if (newAvailableChartTypes.length > 0) {
        setChartType(newAvailableChartTypes[0]);
      }
    }
  };


  const fetchData = async () => {
    setIsLoading(true)
    const newHistoryItem: QueryHistoryItem = {
      id: history.length + 1,
      query,
      timestamp: new Date(),
    };
    setHistory([...history, newHistoryItem]);

    try {
      const dbResponse = await getSqlQueryResults({
        query: query,
        db: localStorage.getItem('module') as string
      });

      if (dbResponse && typeof dbResponse.response === 'string') {
        setErrorMsg(dbResponse.response);
        setSqlData([]);
        setColumns([]);
        setChartType(null);
        setSqlQuery(null);
        return;
      }
      setResponseData(dbResponse?.response)
      if (dbResponse?.response?.sql && Array.isArray(dbResponse.response.sql)) {
        const rows = dbResponse.response.sql;
        const chartType = dbResponse.response.chartType || "";
        const sqlQuery = dbResponse.response.sqlQuery;

        if (rows.length > 0) {
          const cols: Column<RowData>[] = Object.keys(rows[0]).map(key => ({
            Header: key,
            accessor: key,
          }));
          setColumns(cols);
          setSqlData(rows);
          //TODO - Work on chart
          // setChartType(chartType);
          setErrorMsg(null);
          //TODO - Work on getting the output as query
          // setSqlQuery(sqlQuery);
        } else {
          setColumns([]);
          setSqlData([]);
          setChartType(null);
          setErrorMsg("No data returned from query.");
          setSqlQuery(null);
        }
      } else {
        setColumns([]);
        setSqlData([]);
        setChartType(null);
        setErrorMsg("Invalid response format.");
        setSqlQuery(null);
      }
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      console.error("Error fetching data:", err);
      setColumns([]);
      setSqlData([]);
      setChartType(null);
      setErrorMsg("Something went wrong while processing your request.");
      setSqlQuery(null);
    }
  };

  const tableInstance = useTable({ columns, data: sqlData });

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
      case 'tabular':
        return (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  {Object.keys(sqlData[0]).map((key) => (
                    <th key={key} className="table-header">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sqlData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.keys(row).map((key) => (
                      <td key={key} className="table-cell">
                        {row[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div className="dashboard-container">
      <div className="left-panel">
        <div className="schema-section">
          <div className="panel-header">
            <h2>Schema Structure</h2>
          </div>
          <SchemaStructure schema={schema} />
        </div>

        <div className="history-section">
          <div className="panel-header">
            <h2>Query History</h2>
          </div>
          <div className="history-list">
            {history.map(renderHistoryItem)}
          </div>
        </div>
      </div>

      <div className="right-panel">
        <div className="query-section">
          <div className="query-header">
            <h3>Query Editor</h3>
            <div className="buttons-container">
              <button onClick={fetchData} className="run-button">
                Run
              </button>
              {sqlQuery && (
                <button onClick={togglePopup} className="see-query-button">
                  See Query
                </button>
              )}
            </div>
          </div>
          <textarea
            className="query-input"
            placeholder="Enter your SQL query here..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setErrorMsg(null);
              setSqlQuery(null);
            }}
            rows={6}
          />
          {errorMsg && (
            <div className="error-box">
              <p style={{ color: 'red' }}>{errorMsg}</p>
            </div>
          )}
        </div>

        {isPopupOpen && sqlQuery && (
          <div className="popup">
            <div className="popup-content">
              <h4>SQL Query:</h4>
              <pre>{sqlQuery}</pre>
              <button onClick={togglePopup}>Close</button>
            </div>
          </div>
        )}

        <div className="results-section">
          <div className="table-panel">
            <div className="panel-header">
              <div className="tab-selector">
                <button
                  className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
                  onClick={() => setActiveTab('results')}
                >
                  Query Results
                </button>
                <button
                  className={`tab-btn ${activeTab === 'console' ? 'active' : ''}`}
                  onClick={() => setActiveTab('console')}
                >
                  Console
                </button>
              </div>
              {activeTab === 'results' && sqlData.length > 0 && (
                <span className="row-count">{sqlData.length} rows</span>
              )}
            </div>
            <div className="panel-content">
              {activeTab === 'results' ? (
                <div className="table-container">
                  {sqlData?.length > 0 ? (
                    <table {...tableInstance.getTableProps()} className="data-table">
                      <thead>
                        {tableInstance.headerGroups.map((headerGroup: HeaderGroup, index) => (
                          <tr {...headerGroup.getHeaderGroupProps()} key={`header-${index}`}>
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
                      {isLoading ? <Loader /> : <p>No data to display. Run a query to see results.</p>}
                    </div>
                  )}
                </div>
              ) : (
                <div className="console-container">
                  {responseData ? (
                    <div className="console-logs">
                      <pre>
                        {JSON.stringify(responseData, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="empty-console">
                      {isLoading ? <Loader /> : <p>No logs available. Actions will appear here.</p>}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Chart Panel (Right) */}
          <div className="chart-panel">
            <div className="panel-header">
              <h3>Visualization</h3>
              {availableChartTypes?.length > 0 && (
                <div className="chart-type-selector">
                  {availableChartTypes.map((type) => (
                    type && (
                      <button
                        key={type}
                        className={`chart-type-btn ${chartType === type ? 'active' : ''}`}
                        onClick={() => setChartType(type)}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    )
                  ))}
                </div>
              )}
            </div>
            <div className="chart-container">
              {isLoading ? <Loader /> : renderChart()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryEditor;