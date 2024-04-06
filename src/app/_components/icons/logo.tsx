interface IconLogoProps {
  className?: string;
}

export default function IconLogo({ className }: IconLogoProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="#fff"
      stroke="#333"
      stroke-width="9.4"
      width="423"
      height="374"
      viewBox="0 0 423 374"
    >
      <path d="M413 93 212 366 11 93h402Z" />
      <path d="M413 48 212 322 11 48h402Z" />
      <path d="M413 3 212 276 11 3h402Z" />
    </svg>
  );
}
