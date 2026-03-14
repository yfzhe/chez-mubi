import { useState } from "react";
import type { SqlValue } from "@sqlite.org/sqlite-wasm";
import { useDatabase } from "../database";
import "./Query.css";

// TODO:
// - improve layout
// - limit the height of table cell
// - add keybinding

const Query = () => {
  const db = useDatabase();

  const [sql, setSql] = useState("");
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<SqlValue[][]>([]);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    try {
      setError(null);
      const start = performance.now();
      const colNames: string[] = [];
      const result = db.exec({
        sql,
        rowMode: "array",
        columnNames: colNames,
        returnValue: "resultRows",
      });
      const end = performance.now();

      setExecutionTime(end - start);
      setColumns(colNames);
      setRows(result);

      console.log(`Execution time: ${(end - start).toFixed(2)} ms`);
      console.log("Query Results:", result);
    } catch (err: unknown) {
      setError(`${err}`);
      setColumns([]);
      setRows([]);
      setExecutionTime(null);
      console.error("Query error:", err);
    }
  };

  return (
    <div className="query-page">
      <textarea
        placeholder="Enter SQL query to explore the database..."
        value={sql}
        rows={10}
        className="query-textarea"
        onChange={(e) => setSql(e.target.value)}
      />
      <button className="query-execute-button" onClick={handleSubmit}>
        Execute
      </button>
      {error && (
        <div className="query-error">
          <strong>Error:</strong>
          {error}
        </div>
      )}
      {executionTime !== null && (
        <div className="query-execution-meta">
          Execution time: {executionTime.toFixed(2)}ms. Rows returned:{" "}
          {rows.length}.
        </div>
      )}
      {columns.length > 0 && (
        <div className="query-results-wrapper">
          <table className="query-results-table">
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>
                      {cell !== null ? `${cell}` : "NULL"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Query;
