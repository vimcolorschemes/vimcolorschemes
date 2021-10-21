import React from 'react';

interface Props {
  className?: string;
}

function IconArrowCircle({ className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16l4-4-4-4M8 12h8" />
    </svg>
  );
}

export default IconArrowCircle;
