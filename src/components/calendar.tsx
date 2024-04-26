"use client";

import {
  type ColumnDef,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "~/components/icon";
import { Table } from "~/components/table";
import type { TData } from "~/types";
import { Cell } from "./cell";
import { type ActivitySelect } from "~/server/db/schema";
import { Search } from "./search";

const CATEGORY_PATTERNS = {
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
    "zeitgenössisch",
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

const LEVEL_PATTERNS = {
  beginner: [
    "anfänger",
    "anfanger",
    "beginner",
    "basic",
    "(be/i)",
    "int-adv",
    "level 1",
    "einsteigend",
  ],
  intermediate: ["mittelst", "(be/i)", "int-adv", "intermediate"],
  advanced: ["fortg", "profi", "professional", "advanced"],
  open: [],
};

export const Calendar = ({
  rows,
  columnKeys,
}: {
  rows: TData[];
  columnKeys: string[];
}) => {
  const [filters, setFilters] = useState(
    Object.fromEntries(
      Object.keys({ ...CATEGORY_PATTERNS, ...LEVEL_PATTERNS }).map((key) => [
        key,
        true,
      ]),
    ) as Record<
      keyof typeof CATEGORY_PATTERNS | keyof typeof LEVEL_PATTERNS,
      boolean
    >,
  );

  const [search, setSearch] = useState("");

  const columns = useMemo(
    () =>
      columnKeys.map(
        (key): ColumnDef<TData> => ({
          header: key,
          cell: (props) =>
            props.row.original[props.column.id] && (
              <Cell
                key={key}
                activities={props.row.original[props.column.id]!.filter(
                  (activity: ActivitySelect): boolean => {
                    const passingCategories = Object.entries(CATEGORY_PATTERNS)
                      .filter(([_key, list]) => {
                        return list.some((word) =>
                          activity.name?.toLowerCase().includes(word),
                        );
                      })
                      .map(([key, _list]) => key);
                    const categoriesOk = passingCategories.length
                      ? passingCategories.filter(
                          (passed) =>
                            filters[passed as keyof typeof CATEGORY_PATTERNS],
                        ).length > 0
                      : filters.unknown;
                    const passingLevels = Object.entries(LEVEL_PATTERNS)
                      .filter(([_key, list]) => {
                        return list.some((word) =>
                          activity.name?.toLowerCase().includes(word),
                        );
                      })
                      .map(([key, _list]) => key);
                    const levelsOk = passingLevels.length
                      ? passingLevels.filter(
                          (passed) =>
                            filters[passed as keyof typeof LEVEL_PATTERNS],
                        ).length > 0
                      : filters.open;
                    const searchOk = search
                      ? activity.name
                          ?.toLowerCase()
                          .includes(search.toLowerCase())
                        ? true
                        : activity.venueId.includes(search.toLowerCase())
                      : true;
                    return categoriesOk && levelsOk && searchOk;
                  },
                )}
              />
            ),
        }),
      ),
    [columnKeys, filters, search],
  );

  const table = useReactTable({
    columns,
    data: rows,
    getCoreRowModel: getCoreRowModel(),
  });

  const toggleFilter = (
    value: keyof typeof CATEGORY_PATTERNS | keyof typeof LEVEL_PATTERNS,
  ) => {
    setFilters({ ...filters, [value]: !filters[value] });
  };

  return (
    <>
      <header className="w-screen bg-primary p-4 text-white">
        <nav className="grid grid-cols-12 gap-3 text-center">
          <div className="col-span-12 flex flex-wrap justify-center gap-2 text-xl sm:flex-nowrap lg:col-span-5">
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
              tooltip="street dance"
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
              tooltip="fitness and stretching"
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
          <div className="col-span-10 flex flex-wrap justify-center gap-2 text-xl sm:col-span-5 sm:flex-nowrap lg:col-span-3">
            <Icon
              enabled={filters.beginner}
              onClick={() => toggleFilter("beginner")}
              tooltip="beginner"
            >
              🌞
            </Icon>
            <Icon
              enabled={filters.intermediate}
              onClick={() => toggleFilter("intermediate")}
              tooltip="intermediate"
            >
              🌟
            </Icon>
            <Icon
              enabled={filters.advanced}
              onClick={() => toggleFilter("advanced")}
              tooltip="advanced"
            >
              🔥
            </Icon>
            <Icon
              enabled={filters.open}
              onClick={() => toggleFilter("open")}
              tooltip="open level"
            >
              ✨
            </Icon>
          </div>
          <div className="col-span-2 gap-2 text-xl lg:col-span-1">
            <Icon
              enabled={false}
              // onClick={() => toggleFilter("unknown")}
              tooltip="classes with no spots left"
            >
              🙅
            </Icon>
          </div>
          <div className="col-span-12 sm:col-span-5 lg:col-span-3">
            <Search onChange={(value) => setSearch(value)} />
          </div>
        </nav>
      </header>
      <main>
        <Table table={table} />
      </main>
    </>
  );
};
