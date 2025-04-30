import { JSX } from "react/jsx-runtime";

export interface HeaderGroup { getHeaderGroupProps: () => JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>; headers: any[]; }

export interface CreateEvents {
    packageId: string
    module: string
}

export interface GetSqlQueryResults{
    query: string
    db: string
}

export interface OutputContentProps {
  id: string;
  url: string;
}

export interface ProjectCardProps {
    project: string;
}

export interface ProjectFormProps {
  mode: 'input' | 'output';
  onSubmit?: (name: string, desc: string) => void;
  data?: { id: string; url: string };
}

export interface ProjectListProps {
    projects: string[];
}

export interface ColumnSchema {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
}

export interface TableSchema {
  name: string;
  columns: ColumnSchema[];
}

export interface SchemaStructureProps {
  schema: TableSchema[] | null | undefined;
}