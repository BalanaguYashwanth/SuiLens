import { JSX } from "react/jsx-runtime";

export interface HeaderGroup { getHeaderGroupProps: () => JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>; headers: any[]; }

export interface CreateEvents {
    packageId: string
    module: string
}

export interface GetSqlQueryResults{
    text: string
    module: string
}