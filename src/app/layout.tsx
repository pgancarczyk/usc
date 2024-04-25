import "~/styles/globals.css";

export const metadata = {
  title: "USC dance planner 🤸✨",
  description:
    "Urban Sports Club alternative interface for dance classes in Berlin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="grid h-screen w-screen grid-rows-[auto,1fr] overflow-hidden overscroll-none bg-white font-sans text-lg">
        {children}
      </body>
    </html>
  );
}
