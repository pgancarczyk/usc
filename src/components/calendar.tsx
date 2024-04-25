"use client";

import {
  type ColumnDef,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Icon } from "~/components/icon";
import { Table } from "~/components/table";
import type { TData } from "~/types";
import { Cell } from "./cell";
import { type ActivitySelect } from "~/server/db/schema";

const FILTER_PATTERNS = {
  ballet: ["ballet", "barre", "pointe", "spitz"],
  acro: ["acro", "floorwork", "capoeira"],
  social: [
    "bachata",
    "salsa",
    "tango",
    "wcs",
    "kizomba",
    "westcoast",
    "zouk",
    "rumba",
    "west coast swing",
  ],
  contemporary: [
    "contemporary",
    "graham",
    "modern",
    "gaga",
    "floorwork",
    "ecstatic",
    "impro",
  ],
  jazz: ["jazz"],
  pole: ["pole", "aerial", "hoop", "silk", "spinning"],
  workout: [
    "workout",
    "fitness",
    "stretch",
    "flexibility",
    "contorsion",
    "kontorsion",
    "contortion",
    "fatburner",
    "zumba",
    "spagat",
    "gyrokinesis",
    "pilates",
    "yoga",
  ],
  street: [
    "hip hop",
    "hiphop",
    "hip-hop",
    "breaking",
    "breakdance",
    "break dance",
    "k-pop",
    "kpop",
    "k pop",
    "house",
    "shuffle",
    "shuffling",
  ],
  unknown: [],
};

export const Calendar = ({
  rows,
  columnKeys,
}: {
  rows: TData[];
  columnKeys: string[];
}) => {
  const [filters, setFilters] = useState<
    Record<keyof typeof FILTER_PATTERNS, boolean>
  >({
    ballet: false,
    acro: false,
    social: false,
    contemporary: false,
    jazz: false,
    pole: false,
    workout: false,
    street: false,
    unknown: true,
  });

  const columns = useMemo(
    () =>
      columnKeys.map(
        (key): ColumnDef<TData> => ({
          header: key,
          cell: (props) =>
            props.row.original[props.column.id] && (
              <Cell
                activities={props.row.original[props.column.id]!.filter(
                  (activity: ActivitySelect): boolean => {
                    const passing = Object.keys(filters).filter((key) => {
                      const list =
                        FILTER_PATTERNS[key as keyof typeof FILTER_PATTERNS];
                      return list.some((word) =>
                        activity.name?.toLowerCase().includes(word),
                      );
                    });
                    if (!passing.length) return filters.unknown;
                    return (
                      passing.filter(
                        (passed) =>
                          filters[passed as keyof typeof FILTER_PATTERNS],
                      ).length > 0
                    );
                  },
                )}
              />
            ),
        }),
      ),
    [columnKeys, filters],
  );

  const table = useReactTable({
    columns,
    data: rows,
    getCoreRowModel: getCoreRowModel(),
  });

  const toggleFilter = (value: keyof typeof FILTER_PATTERNS) => {
    setFilters({ ...filters, [value]: !filters[value] });
  };

  return (
    <>
      <header className="w-screen bg-primary p-4 text-white">
        <nav className="grid gap-3 text-center sm:grid-cols-2 md:grid-cols-3">
          <div className="flex justify-center gap-2 text-xl">
            <Icon
              enabled={filters.ballet}
              onClick={() => toggleFilter("ballet")}
              tooltip="ballet"
            >
              🩰
            </Icon>
            <Icon
              enabled={filters.acro}
              onClick={() => toggleFilter("acro")}
              tooltip="acro and floorwork"
            >
              🤸
            </Icon>
            <Icon
              enabled={filters.social}
              onClick={() => toggleFilter("social")}
              tooltip="social dances"
            >
              💃
            </Icon>
            <Icon
              enabled={filters.contemporary}
              onClick={() => toggleFilter("contemporary")}
              tooltip="contemporary"
            >
              🎭
            </Icon>
            <Icon
              enabled={filters.jazz}
              onClick={() => toggleFilter("jazz")}
              tooltip="jazz"
            >
              🕺
            </Icon>
            <Icon
              enabled={filters.street}
              onClick={() => toggleFilter("street")}
              tooltip="hip hop and street dance"
            >
              👟
            </Icon>
            <Icon
              enabled={filters.pole}
              onClick={() => toggleFilter("pole")}
              tooltip="pole dance and aerial hoop"
            >
              🎪
            </Icon>
            <Icon
              enabled={filters.workout}
              onClick={() => toggleFilter("workout")}
              tooltip="fitness focused and stretching"
            >
              💪
            </Icon>
            <Icon
              enabled={filters.unknown}
              onClick={() => toggleFilter("unknown")}
              tooltip="unknown"
            >
              🔮
            </Icon>
          </div>
          <div className="flex justify-center gap-2 text-xl">
            <Icon tooltip="beginner">🌞</Icon>
            <Icon tooltip="intermediate">🌟</Icon>
            <Icon enabled tooltip="advanced">
              🔥
            </Icon>
            <Icon enabled tooltip="open level">
              ✨
            </Icon>
          </div>
          <div className="sm:col-span-2 md:col-span-1">
            <input
              className="w-full border-b-2 bg-primary p-1 placeholder-white placeholder-opacity-60 opacity-60 outline-none focus:opacity-100"
              list="usc"
              placeholder="start typing class or venue name..."
            />
          </div>
        </nav>
      </header>
      <main>
        <Table table={table} />
      </main>
    </>
  );
};
