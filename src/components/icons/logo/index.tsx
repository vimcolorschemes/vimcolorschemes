import React from 'react';

interface Props {
  className?: string;
}

function IconLogo({ className }: Props) {
  return (
    <svg
      className={className}
      width="423"
      height="374"
      viewBox="0 0 423 374"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0)">
        <path
          d="M413.245 92.7072L212.062 366.054L10.8788 92.7072L413.245 92.7072Z"
          fill="white"
          stroke="#333333"
          strokeWidth="9.42"
        />
        <path
          d="M413.245 48.4145L212.062 321.762L10.8788 48.4145L413.245 48.4145Z"
          fill="white"
          stroke="#333333"
          strokeWidth="9.42"
        />
        <path
          d="M413.245 3.04422L212.062 276.391L10.8788 3.04422L413.245 3.04422Z"
          fill="white"
          stroke="#333333"
          strokeWidth="9.42"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="423" height="374" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default IconLogo;
