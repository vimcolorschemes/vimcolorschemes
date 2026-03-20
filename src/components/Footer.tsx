export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex w-full max-w-[80rem] items-center px-4 py-6 md:px-8">
        <p className="text-sm text-muted-foreground">
          &copy; {year} vimcolorschemes
        </p>
      </div>
    </footer>
  );
}
