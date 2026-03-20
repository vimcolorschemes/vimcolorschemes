import getAppMetaTitle from '#/helpers/pageTitle';
import Backgrounds from '#/lib/backgrounds';
import type { BackgroundFilter } from '#/lib/filter';

type GetRepositoryListingMetaTitleInput = {
  page?: number;
  background?: BackgroundFilter;
};

export default function getRepositoryListingMetaTitle({
  page = 1,
  background,
}: GetRepositoryListingMetaTitleInput): string {
  const parts = ['trending'];

  if (background === Backgrounds.Dark || background === Backgrounds.Light) {
    parts.push(background);
  } else if (background === 'both') {
    parts.push('light and dark');
  }

  parts.push('colorschemes');

  const baseTitle = parts.join(' ');
  const title = page > 1 ? `${baseTitle} - page ${page}` : baseTitle;

  return getAppMetaTitle(title);
}
