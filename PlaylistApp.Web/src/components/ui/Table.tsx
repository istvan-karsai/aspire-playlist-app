import type { ButtonHTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";

export const Table = ({ children }: { children: ReactNode }) => (
    <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto">
        <table className="w-full min-w-full text-sm table-fixed">
            {children}
        </table>
    </div>
);

export const TableHeader = ({ children }: { children: ReactNode }) => (
    <thead className="bg-gray-50 border-b">
        <tr>{children}</tr>
    </thead>
);

export const TableBody = ({ children }: { children: ReactNode }) => (
    <tbody className="divide-y divide-gray-200">
        {children}
    </tbody>
);

export const TableRow = ({ children }: { children: ReactNode }) => (
    <tr className="hover:bg-gray-50 transition-colors">
        {children}
    </tr>
);

interface TableHeadCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
    children: ReactNode;
}

export const TableHeadCell = ({ children, className = "", ...props }: TableHeadCellProps) => (
    <th className={`h-12 px-4 text-left font-medium text-gray-500 ${className}`} {...props}>
        {children}
    </th>
);

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
    children: ReactNode;
}

export const TableCell = ({ children, className = "", ...props }: TableCellProps) => (
    <td className={`p-4 text-gray-600 ${className}`} {...props}>
        {children}
    </td>
);

export type TableActionVariant = "primary" | "danger";

interface TableActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: TableActionVariant;
}

export const TableAction = ({ variant = "primary", className = "", ...props }: TableActionProps) => {
    const colorClass = variant === "danger" 
        ? "text-red-600 hover:text-red-800" 
        : "text-indigo-600 hover:text-indigo-900";
        
    return (
        <button
            type="button"
            className={`font-medium text-sm transition-colors disabled:opacity-50 mr-4 last:mr-0 ${colorClass} ${className}`}
            {...props}
        />
    );
};