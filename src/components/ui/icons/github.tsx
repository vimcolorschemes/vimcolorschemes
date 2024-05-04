type IconGithubProps = {
  className?: string;
};

export default function IconGithub({ className }: IconGithubProps) {
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
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-1-2.6c3.2-.3 6.5-1.5 6.5-7A5.4 5.4 0 0 0 20 4.8 5 5 0 0 0 20 1s-1.3-.3-4 1.5a13.4 13.4 0 0 0-7 0C6.3.6 5 1 5 1a5 5 0 0 0 0 3.8 5.4 5.4 0 0 0-1.5 3.7c0 5.5 3.3 6.7 6.4 7a3.4 3.4 0 0 0-.9 2.6V22" />
    </svg>
  );
}
