/** Route slug for category discover (ALL selected, full chip row). */
export const CATEGORY_DISCOVER_SLUG = 'discover';

export function isCategoryDiscoverSlug(slug: string): boolean {
  return slug.trim().toLowerCase() === CATEGORY_DISCOVER_SLUG;
}

export function categoryDiscoverHref(): `/category/${string}` {
  return `/category/${CATEGORY_DISCOVER_SLUG}`;
}
