/** Normalize to digits only (optional leading 91 stripped for validation). */
export function normalizeIndianPhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
}

/** Matches API `validateIndianMobileNumber` for 10-digit Indian mobiles. */
export function isValidIndianPhone(input: string): boolean {
  const phone = normalizeIndianPhone(input);
  return /^[6-9]\d{9}$/.test(phone);
}
