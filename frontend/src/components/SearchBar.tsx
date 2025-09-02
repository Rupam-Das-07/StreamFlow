"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// removed dropdown command for a simpler design
import { Search, Loader2, X } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  placeholder?: string;
  className?: string;
};

export default function SearchBar({ value, onChange, onSubmit, loading, placeholder = "Search...", className }: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [focused, setFocused] = React.useState(false);

  return (
    <div className={className}>
      <div className="relative w-full">
        {/* Leading search icon */}
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Search size={18} />
        </div>

        {/* Clear button */}
        {value && !loading ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-28 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full"
            onClick={() => onChange("")}
          >
            <X size={16} />
          </Button>
        ) : null}

        {/* Submit button */}
        <Button
          type="button"
          className="absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-full px-5"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Search"}
        </Button>

        {/* Input field */}
        <motion.div initial={false} animate={{ boxShadow: focused ? "0 8px 32px rgba(0,0,0,0.22)" : "none" }} className="rounded-full">
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSubmit();
            }}
            placeholder={placeholder}
            className="h-14 w-full rounded-full border border-white/10 bg-transparent pl-12 pr-32 text-base placeholder:text-muted-foreground focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-primary/40"
          />
        </motion.div>
      </div>
    </div>
  );
}


