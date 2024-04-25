export const Icon = ({
  children,
  enabled,
  tooltip,
  onClick,
}: {
  children: React.ReactNode;
  enabled?: boolean;
  tooltip?: string;
  onClick?: () => void;
}) => {
  return (
    <div
      title={tooltip}
      onClick={onClick}
      className={`${enabled && "bg-white"} w-12 scale-90 cursor-pointer rounded-xl border-2 border-white  p-1 opacity-90 transition hover:scale-100 hover:opacity-100`}
    >
      {children}
    </div>
  );
};
