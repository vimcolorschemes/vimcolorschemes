import { RepositoryDTO } from '@/models/DTO/repository';

let manifestPromise: Promise<RepositoryDTO[]> | null = null;

async function fetchRepositorySearchManifest(): Promise<RepositoryDTO[]> {
  try {
    const response = await fetch('/search/repositories.json');

    if (!response.ok) {
      throw new Error(`Failed to load search manifest: ${response.status}`);
    }

    return (await response.json()) as RepositoryDTO[];
  } catch (error) {
    manifestPromise = null;
    throw error;
  }
}

async function loadRepositorySearchManifest(): Promise<RepositoryDTO[]> {
  if (manifestPromise) {
    return manifestPromise;
  }

  manifestPromise = fetchRepositorySearchManifest();
  return manifestPromise;
}

export const RepositorySearchManifestClient = {
  loadRepositorySearchManifest,
};
