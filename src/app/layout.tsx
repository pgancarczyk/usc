import "~/styles/globals.css";

export const metadata = {
  title: "USC 💃💃",
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
      <body className="grid h-screen w-screen grid-rows-[auto,1fr] bg-white font-sans text-lg">
        {children}
      </body>
    </html>
  );
}
