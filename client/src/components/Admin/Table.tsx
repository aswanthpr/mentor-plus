import { ReactNode } from 'react';

interface TableProps {
  headers: string[];
  children: ReactNode;
}

export const Table = ({ headers, children }: TableProps) => {
  return (
    <div className="overflow-x-auto mt-2">
      <table className="min-w-full divide-y divide-gray-200 table-fixed">
        <thead className="bg-gray-50 ">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="text-center py-3  text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4" // Adjust w-1/4 or use another fraction like w-1/6, w-1/3, etc.
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {children}
        </tbody>
      </table>
    </div>
  );
};