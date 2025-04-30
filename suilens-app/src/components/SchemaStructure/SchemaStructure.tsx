import React, { useState } from "react";
import { SchemaStructureProps } from "../../common/types";
import "./SchemaStructure.scss";

const SchemaStructure: React.FC<SchemaStructureProps> = ({ schema }) => {
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({});

  const toggleTableExpand = (tableName: string) => {
    setExpandedTables(prev => ({
      ...prev,
      [tableName]: !prev[tableName]
    }));
  };

  if (!Array.isArray(schema)) {
    return <div className="schema-empty">No schema available</div>;
  }

  if (schema.length === 0) {
    return <div className="schema-empty">Loading schema...</div>;
  }

  return (
    <div className="schema-container">
      {schema.map(table => (
        <div key={table.name} className="schema-table">
          <div 
            className="schema-table-header" 
            onClick={() => toggleTableExpand(table.name)}
          >
            <span className="schema-table-name">{table.name}</span>
            <span className="schema-table-toggle">
              {expandedTables[table.name] ? '−' : '+'}
            </span>
          </div>
          {expandedTables[table.name] && (
            <div className="schema-columns">
              {table.columns.map(column => (
                <div key={column.name} className="schema-column">
                  <span className="column-name">{column.name}</span>
                  <span className="column-type">{column.type}</span>
                  {column.primaryKey && <span className="column-pk">PK</span>}
                  {column.nullable && <span className="column-nullable">NULL</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SchemaStructure;