import React from 'react';

interface Props {
  className?: string;
}

function IconCheckboxUnchecked({ className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className={className}
      viewBox="0 0 24 24"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    </svg>
  );
}

export default IconCheckboxUnchecked;
