import { useEffect, useState } from "react";

export const Search = ({ onChange }: { onChange: (value: string) => void }) => {
  const [debounceSearch, setDebounceSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(debounceSearch);
    }, 200);

    return () => clearTimeout(timeout);
  }, [debounceSearch, onChange]);

  return (
    <input
      className="w-full border-b-2 bg-primary p-1 placeholder-white placeholder-opacity-60 opacity-60 outline-none focus:opacity-100"
      list="usc"
      placeholder="start typing class or venue name..."
      onChange={(e) => setDebounceSearch(e.target.value)}
    />
  );
};
