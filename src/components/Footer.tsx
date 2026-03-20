import Logo from '#/components/Logo';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex w-full max-w-[80rem] items-center px-4 py-6 md:px-8">
        <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Logo className="h-4 w-4 shrink-0" />
          <span>&copy; {year} vimcolorschemes</span>
        </p>
      </div>
    </footer>
  );
}
