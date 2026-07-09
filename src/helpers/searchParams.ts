type SearchParams = Record<string, string | string[] | undefined>;

function getValue(searchParams: SearchParams, key: string): string | undefined {
  const value = searchParams[key];
  const firstValue = Array.isArray(value) ? value[0] : value;
  const trimmedValue = firstValue?.trim();

  return trimmedValue || undefined;
}

export const SearchParamsHelper = { getValue };
