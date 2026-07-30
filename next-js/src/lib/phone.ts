/** Russian phone mask: +7 (999) 123-45-67 */

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** Normalize to 11 digits starting with 7 */
export function normalizeRuPhoneDigits(raw: string): string {
  let d = digitsOnly(raw);
  if (d.startsWith("8") && d.length >= 11) {
    d = "7" + d.slice(1);
  }
  if (!d.startsWith("7") && d.length > 0) {
    d = "7" + d;
  }
  return d.slice(0, 11);
}

export function formatRuPhone(raw: string): string {
  const d = normalizeRuPhoneDigits(raw);
  if (d.length === 0) return "";

  const rest = d.slice(1);
  let out = "+7";
  if (rest.length === 0) return out;

  out += " (";
  out += rest.slice(0, 3);
  if (rest.length <= 3) return out;

  out += ") ";
  out += rest.slice(3, 6);
  if (rest.length <= 6) return out;

  out += "-";
  out += rest.slice(6, 8);
  if (rest.length <= 8) return out;

  out += "-";
  out += rest.slice(8, 10);
  return out;
}

export function isCompleteRuPhone(raw: string): boolean {
  return normalizeRuPhoneDigits(raw).length === 11;
}
