import React from 'react';

export default function Logo({ className = 'h-8 w-auto' }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-2 font-black ${className}`}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-emerald-500 shrink-0"
      >
        <title>GearUp Logo</title>
        <rect width="40" height="40" rx="10" fill="currentColor" fillOpacity="0.12" />
        <path d="M20 7L8 28H14L20 18L26 28H32L20 7Z" fill="currentColor" />
        <circle cx="20" cy="30" r="2.5" fill="#f59e0b" />
      </svg>
      <span className="text-xl font-black tracking-tight text-foreground">
        Gear<span className="text-emerald-500">Up</span>
      </span>
    </div>
  );
}

export { Logo };
