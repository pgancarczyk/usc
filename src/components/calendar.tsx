"use client";
import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { type ActivitySelect } from "~/server/db/schema";

type TData = Record<string, ActivitySelect[]>;

export const Calendar = ({ activities }: { activities: ActivitySelect[] }) => {
  const columns = useMemo(
    () =>
      [
        ...new Set(
          activities.map((activity) =>
            activity.start.toLocaleDateString("de-DE"),
          ),
        ),
      ].map(
        (day): ColumnDef<TData> => ({
          header: day,
          accessorFn: (row) => row.day,
          cell: (props) => {
            const activities = props.row.original[props.column.id];
            return (
              <div className="bg-primary-light m-1 rounded-xl">
                {activities?.map((activity, index) => {
                  const nameCell = (
                    <div
                      className="overflow-hidden text-ellipsis p-2"
                      key={activity.id}
                    >
                      {activity.name}
                    </div>
                  );
                  if (index) return nameCell;
                  return (
                    <>
                      <div
                        className="p-1 font-bold text-primary"
                        key={activity.start.toISOString()}
                      >
                        {activity.start.toLocaleTimeString("de-DE", {
                          timeStyle: "short",
                        })}
                      </div>
                      {nameCell}
                    </>
                  );
                })}
              </div>
            );
          },
        }),
      ),
    [activities],
  );
  const data = useMemo(
    () =>
      [
        ...new Set(
          activities.map((activity) =>
            activity.start.toLocaleTimeString("de-DE"),
          ),
        ),
      ].map((start): TData => {
        const rowActivities = activities.filter(
          (activity) => activity.start.toLocaleTimeString("de-DE") === start,
        );
        const columnKeys = [
          ...new Set(
            activities.map((activity) =>
              activity.start.toLocaleDateString("de-DE"),
            ),
          ),
        ];
        return Object.fromEntries(
          columnKeys.map((columnKey) => [
            columnKey,
            rowActivities.filter(
              (activity) =>
                activity.start.toLocaleDateString("de-DE") === columnKey,
            ),
          ]),
        );
      }),
    [activities],
  );

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

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
                  className="inline-block w-96 overflow-hidden align-top"
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
