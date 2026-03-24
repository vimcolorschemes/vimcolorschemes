type RepositoriesCountProps = {
  countPromise: Promise<number>;
};

export default async function RepositoriesCount({
  countPromise,
}: RepositoriesCountProps) {
  const count = await countPromise;

  return (
    <p>
      {count} repositor{count === 1 ? 'y' : 'ies'}
    </p>
  );
}
