export function filterSourceEntries<T extends { category: string }>(
  entries: T[],
  activeCategory: string,
  allCategory: string,
) {
  return entries.filter((entry) => activeCategory === allCategory || entry.category === activeCategory);
}
