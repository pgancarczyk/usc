import { db } from "~/server/db";
import { between } from "drizzle-orm";
import { activities } from "~/server/db/schema";
import { Icon } from "~/components/icon";
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

  const venues = [...new Set(data.map((activity) => activity.venueId))];
  const classNames = [
    ...new Set(
      data.flatMap((activity) => (activity.name ? activity.name : [])),
    ),
  ];

  return (
    <>
      <header className="w-screen bg-primary p-4 text-white">
        <nav className="grid gap-3 text-center sm:grid-cols-2 md:grid-cols-3">
          <div className="flex justify-center gap-2 text-xl">
            <Icon>🩰</Icon>
            <Icon enabled>🤸</Icon>
            <Icon tooltip="this is enabled">💃</Icon>
            <Icon>🕺</Icon>
            <Icon>🎭</Icon>
          </div>
          <div className="flex justify-center gap-2 text-xl">
            <Icon>🌞</Icon>
            <Icon>🌟</Icon>
            <Icon enabled>🔥</Icon>
            <Icon enabled>✨</Icon>
          </div>
          <div className="sm:col-span-2 md:col-span-1">
            <input
              className="w-full border-b-2 bg-primary p-1 placeholder-white placeholder-opacity-60 opacity-60 outline-none focus:opacity-100"
              list="usc"
              placeholder="start typing class or venue name..."
            />
            <datalist id="usc">
              {[...venues, ...classNames].map((name) => (
                <option key={name} value={name}></option>
              ))}
            </datalist>
          </div>
        </nav>
      </header>
      <main>
        <Calendar activities={data} />
      </main>
    </>
  );
}
