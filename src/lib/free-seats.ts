/** Early-access lifetime-free seats. Bump REGISTERED_COUNT as signups grow. */
export const FREE_SEATS_TOTAL = 500;
export const REGISTERED_COUNT = 12;
export const REMAINING_FREE_SEATS = Math.max(0, FREE_SEATS_TOTAL - REGISTERED_COUNT);

export function faNumber(n: number) {
  return n.toLocaleString("fa-IR");
}
