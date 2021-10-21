import React from 'react';

interface Props {
  className?: string;
}

function IconLogo({ className }: Props) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 423 374"
    >
      <g fill="#fff" stroke="#333" strokeWidth="9.42">
        <path d="M413.245 92.707 212.062 366.054 10.879 92.707h402.366Z" />
        <path d="M413.245 48.414 212.062 321.762 10.879 48.414h402.366Z" />
        <path d="M413.245 3.044 212.062 276.391 10.879 3.044h402.366Z" />
      </g>
    </svg>
  );
}

export default IconLogo;
