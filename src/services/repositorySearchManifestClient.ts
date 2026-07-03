import { RepositoryDTO } from '@/models/DTO/repository';

let manifestPromise: Promise<RepositoryDTO[]> | null = null;

async function loadRepositorySearchManifest(): Promise<RepositoryDTO[]> {
  manifestPromise ??= fetch('/search/repositories.json').then(response => {
    if (!response.ok) {
      throw new Error(`Failed to load search manifest: ${response.status}`);
    }

    return response.json() as Promise<RepositoryDTO[]>;
  });

  return manifestPromise;
}

export const RepositorySearchManifestClient = {
  loadRepositorySearchManifest,
};
