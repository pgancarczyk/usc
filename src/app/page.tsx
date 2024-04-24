import { db } from "~/server/db";
import { between } from "drizzle-orm";
import { activities } from "~/server/db/schema";

const DAYS_AHEAD = 3;

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

  const days = [...Array(DAYS_AHEAD).keys()].map((key) => {
    const midnight = new Date(lastMidnight);
    const nextMidnight = new Date(lastMidnight);
    midnight.setDate(nextMidnight.getDate() + key);
    nextMidnight.setDate(nextMidnight.getDate() + key + 1);

    const index = data.findIndex((activity) => activity.start > nextMidnight);
    const activities = index === -1 ? data : data.splice(0, index);

    return { date: midnight, activities };
  });

  return (
    <>
      <header className="bg-primary w-full p-4 text-white">
        <nav className="grid grid-cols-3 pb-2 text-center">
          <div className="flex justify-center gap-2 text-xl">
            <div className="w-12 cursor-pointer rounded-xl bg-white p-1">
              🩰
            </div>
            <div className="w-12 cursor-pointer rounded-xl border-2 border-white p-1">
              🤸
            </div>
            <div className="w-12 cursor-pointer rounded-xl border-2 border-white p-1">
              💃
            </div>
            <div className="w-12 cursor-pointer rounded-xl border-2 border-white p-1">
              🕺
            </div>
          </div>
          <div className="flex justify-center gap-2 text-xl">
            <div className="w-12 cursor-pointer rounded-xl bg-white p-1">
              🌞
            </div>
            <div className="w-12 cursor-pointer rounded-xl border-2 border-white p-1">
              🌟
            </div>
            <div className="w-12 cursor-pointer rounded-xl border-2 border-white p-1">
              🔥
            </div>
            <div className="w-12 cursor-pointer rounded-xl border-2 border-white p-1">
              ✨
            </div>
          </div>
          <div>
            <input
              className="bg-primary w-full border-b-2 p-1 outline-none"
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
      <main className={`grid grid-cols-3 gap-4 p-4`}>
        {days.map((day) => (
          <section key={day.date.toISOString()}>
            <h2 className="pb-2">{day.date.toLocaleDateString()}</h2>
            <ul>
              {day.activities.map((activity) => (
                <li
                  className="overflow-hidden text-ellipsis whitespace-nowrap"
                  key={activity.id}
                >
                  {activity.start.toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                  , {activity.name}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </>
  );
}
