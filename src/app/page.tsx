import { db } from "~/server/db";
import { between } from "drizzle-orm";
import { activities } from "~/server/db/schema";
import type { TData } from "~/types";
import { Calendar } from "~/components/calendar";

const DAYS_AHEAD = 6;

export default async function HomePage() {
  const lastMidnight = new Date();
  lastMidnight.setHours(0, 0, 0, 0);
  const maxMidnight = new Date(lastMidnight);
  maxMidnight.setDate(maxMidnight.getDate() + DAYS_AHEAD);

  const data = await db.query.activities.findMany({
    where: between(activities.start, lastMidnight, maxMidnight),
    orderBy: activities.start,
  });

  const rows = [
    ...new Set(
      data.map((activity) => activity.start.toLocaleTimeString("de-DE")),
    ),
  ].map((start): TData => {
    const rowActivities = data.filter(
      (activity) => activity.start.toLocaleTimeString("de-DE") === start,
    );
    const columnKeys = [
      ...new Set(
        rowActivities.map((activity) =>
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
  });

  const columnKeys = [
    ...new Set(
      data.map((activity) => activity.start.toLocaleDateString("de-DE")),
    ),
  ];

  return <Calendar rows={rows} columnKeys={columnKeys} />;
}
