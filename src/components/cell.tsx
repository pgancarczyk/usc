import { type ActivitySelect } from "~/server/db/schema";

export const Cell = ({ activities }: { activities: ActivitySelect[] }) => {
  return (
    <div className="bg-primary-light m-1 rounded-xl">
      {activities?.map((activity, index) => {
        const nameCell = (
          <div className="overflow-hidden text-ellipsis p-2" key={activity.id}>
            {activity.name}
            <br />
            <span className="text-sm">{activity.venueId}</span>
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
};
