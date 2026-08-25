export function buildRepositoryPath(ownerName: string, name: string): string {
  return `/r/${ownerName}/${name}`.toLowerCase();
}

export function buildRepositoryStaticParam(ownerName: string, name: string) {
  return { owner: ownerName.toLowerCase(), name: name.toLowerCase() };
}
