export type Neighborhood =
  | "عدن كريتر"
  | "كريتر"
  | "خور مكسر"
  | "المعلا"
  | "التواهي"
  | "الشيخ عثمان"
  | "المنصورة"
  | "دار سعد"
  | "البريقة";

export const NEIGHBORHOODS: Neighborhood[] = [
  "عدن كريتر",
  "كريتر",
  "خور مكسر",
  "المعلا",
  "التواهي",
  "الشيخ عثمان",
  "المنصورة",
  "دار سعد",
  "البريقة",
];

export function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function shareText(text: string): void {
  try {
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
      return;
    }
  } catch {}
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(whatsapp, "_blank");
}

export function smsLink(phone: string, body: string): string {
  return `sms:${encodeURIComponent(phone)}?&body=${encodeURIComponent(body)}`;
}

export function telLink(phone: string): string {
  return `tel:${encodeURIComponent(phone)}`;
}

export type Bookmark = { id: string; type: string; title: string };

export function toggleBookmark(item: Bookmark): boolean {
  const key = "bookmarks";
  const list = getLocal<Bookmark[]>(key, []);
  const exists = list.some((b) => b.id === item.id && b.type === item.type);
  const updated = exists
    ? list.filter((b) => !(b.id === item.id && b.type === item.type))
    : [...list, item];
  setLocal(key, updated);
  return !exists;
}

export type PriceTrack = { id: string; title: string; price: number; seller?: string };

export function trackPrice(item: PriceTrack): void {
  const key = "price-tracking";
  const list = getLocal<PriceTrack[]>(key, []);
  const idx = list.findIndex((p) => p.id === item.id);
  if (idx >= 0) list[idx] = item; else list.push(item);
  setLocal(key, list);
}

export function getTrackedPrices(): PriceTrack[] {
  return getLocal<PriceTrack[]>("price-tracking", []);
}

export type LocalKey =
  | 'selected-neighborhood'
  | 'electricity-votes'
  | 'electricity-comments'
  | 'electricity-favorites'
  | 'electricity-price-tracking'
  | 'electricity-last-calculation'
  | 'electricians-cache';

export function readLocal<T>(key: LocalKey, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeLocal<T>(key: LocalKey, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function toggleFavorite(id: string) {
  const current = readLocal<string[]>('electricity-favorites', []);
  const exists = current.includes(id);
  const next = exists ? current.filter(x => x !== id) : [...current, id];
  writeLocal('electricity-favorites', next);
  return next;
}

export type DistrictCode =
  | 'seera'
  | 'khormaksar'
  | 'almaalla'
  | 'altawahi'
  | 'shaikh-othman'
  | 'mansoura'
  | 'darsaad'
  | 'albareeqa';

export const ADEN_DISTRICTS: { value: DistrictCode; text: string }[] = [
  { value: 'seera', text: 'عدن كريتر' },
  { value: 'khormaksar', text: 'خور مكسر' },
  { value: 'almaalla', text: 'المعلا' },
  { value: 'altawahi', text: 'التواهي' },
  { value: 'shaikh-othman', text: 'الشيخ عثمان' },
  { value: 'mansoura', text: 'المنصورة' },
  { value: 'darsaad', text: 'دار سعد' },
  { value: 'albareeqa', text: 'البريقة' },
];

export const ADEN_DISTRICT_TEXT: Record<DistrictCode, string> = ADEN_DISTRICTS
  .reduce((acc, d) => { acc[d.value] = d.text; return acc; }, {} as Record<DistrictCode, string>);

export const ADEN_NEIGHBORHOODS = [
  'عدن كريتر',
  'خور مكسر',
  'المعلا',
  'التواهي',
  'الشيخ عثمان',
  'المنصورة',
  'دار سعد',
  'البريقة',
];

