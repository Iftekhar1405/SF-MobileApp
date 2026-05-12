/** Static MOQ v1 — replace with GET /cart/moq when backend exists */
export const MOQ_BY_CATEGORY: Record<string, number> = {
  footwear: 5,
  hawai: 10,
  PU: 3,
  PVC: 3,
  EVA: 3,
  default: 1,
};

export function getMoqForCategory(category?: string): number {
  if (!category) return MOQ_BY_CATEGORY.default;
  const key = Object.keys(MOQ_BY_CATEGORY).find(
    (k) => k !== 'default' && category.toLowerCase().includes(k.toLowerCase())
  );
  return MOQ_BY_CATEGORY[key ?? 'default'] ?? MOQ_BY_CATEGORY.default;
}
