import { env } from "~/env";
import { parse } from 'node-html-parser';
import { InsertActivity, activities } from "~/server/db/schema";
import { db } from "~/server/db";
import { sql } from "drizzle-orm";

export const dynamic = 'force-dynamic';

const ACTIVITIES_PATH = "/en/activities";
const VENUE_PATH = "/en/venues";
const ACTIVITIES_FILTERS = "city_id=1&business_type%5B%5D=b2c&plan_type=2&type%5B%5D=onsite&category[]=40005&page=99&previous-pages"

const fetchActivities = async (date: Date) => {
    return [];

    date.setDate(date.getDate() + 0);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    const dateFilter = `date=${year}-${month}-${day}`;
    const activitiesUrl = `${env.USC_URL}${ACTIVITIES_PATH}?${dateFilter}&${ACTIVITIES_FILTERS}`;

    const response = await fetch(activitiesUrl);
    const data = await response.text();

    const root = parse(data);
    const activityNodes = root.querySelectorAll('.smm-class-snippet');

    const activities: InsertActivity[] = activityNodes.flatMap(node => {

        const id = Number(node.getAttribute('data-appointment-id'));
        const venueId = node.querySelector('.smm-studio-link')?.getAttribute('href')?.split('/').pop()!;
        const name = node.querySelector('.smm-class-link.title')?.rawText.trim();

        const duration = node.querySelector('.smm-class-snippet__class-time')?.rawText.trim().split('&nbsp;&mdash;')!;
        if (!duration) return []; // skip classes with no time specified
        const startTimes = duration[0]?.split(':').map(t => Number(t));
        const endTimes = duration[1]?.split(':').map(t => Number(t));
        const start = new Date(year, date.getMonth(), date.getDate(), startTimes![0], startTimes![1]);
        const end = new Date(year, date.getMonth(), date.getDate(), endTimes![0], endTimes![1]);

        return { id, name, venueId, start, end };
    })

    return activities;
}

export async function GET(request: Request) {

    const data: InsertActivity[] = await fetchActivities(new Date());

    const result = data.length ? await db.insert(activities).values(data).onConflictDoUpdate({
        target: activities.id,
        set: {
            name: sql.raw(`excluded.${activities.name.name}`),
            start: sql.raw(`excluded.${activities.start.name}`),
            end: sql.raw(`excluded.${activities.end.name}`),
            updatedAt: new Date(),
        }
    }) : { rowCount: 0 };

    return new Response(`upserted ${result.rowCount} rows`);
}