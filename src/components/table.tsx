import { type Table as ReactTable, flexRender } from "@tanstack/react-table";
import type { TData } from "~/types";

export const Table = ({ table }: { table: ReactTable<TData> }) => {
  return (
    <div className="w-screen overflow-x-auto whitespace-nowrap">
      <table className="grid grid-rows-[auto,1fr]">
        <thead className="scrollbar-gutter block">
          <tr className="block">
            {table.getFlatHeaders().map((header) => (
              <th className="m-1 inline-block w-96" key={header.id}>
                {header.id}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="mx-2 block h-screen overflow-y-auto overflow-x-clip">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="block">
              {row.getVisibleCells().map((cell) => (
                <td
                  className="inline-block w-96 max-w-[100vmin] overflow-hidden align-top"
                  key={cell.id}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
