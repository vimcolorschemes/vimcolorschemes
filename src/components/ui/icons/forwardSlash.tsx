type IconForwardSlashProps = {
  className?: string;
};

export default function IconForwardSlash({ className }: IconForwardSlashProps) {
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
      style={{ transform: 'rotate(-28deg)' }}
    >
      <line x1="23" y1="1" x2="1" y2="23"></line>
    </svg>
  );
}
