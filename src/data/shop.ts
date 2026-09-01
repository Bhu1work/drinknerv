import canOrange from '~/assets/can-orange.png'
import canMango from '~/assets/can-mango.png'
// TEMPORARY: single 3D can render used for both flavours until per-flavour
// shots exist. Swap `img` back to canOrange / canMango to restore.
import canPlaceholder from '~/assets/can-placeholder.png'

void canOrange
void canMango

/** Shopify storefront + coupon. */
export const STORE_URL = 'https://nerv-2782.myshopify.com'
export const COUPON = 'FOCUS10'
export const INSTAGRAM_URL = 'https://www.instagram.com/drinknerv'
export const SUPPORT_EMAIL = 'sales@clearstream.co.in'
export const SUPPORT_PHONE = '+91 91111 95119'

export type FlavorId = 'orange' | 'mango'
export type PackId = '6' | '12' | '24'

export const FLAVORS: Record<
  FlavorId,
  { name: string; protocol: string; tags: string; img: string; tint: string }
> = {
  orange: {
    name: 'Orange Coffee',
    protocol: 'Citrus · Coffee Bean',
    tags: 'L-Theanine + Caffeine',
    img: canPlaceholder,
    tint: 'rgba(217,213,35,0.10)',
  },
  mango: {
    name: 'Mango Chilli',
    protocol: 'Tropical · Chilli',
    tags: 'L-Theanine + Caffeine',
    img: canPlaceholder,
    tint: 'rgba(192,57,43,0.12)',
  },
}

/**
 * Nutrition exactly as printed on the can labels.
 * Serving size 250 ml · 1 serving per package. Values differ slightly by
 * flavour, so keep these in sync with the artwork rather than rounding.
 */
export type NutritionRow = { label: string; value: string; highlight?: boolean }

export const NUTRITION: Record<FlavorId, Array<NutritionRow>> = {
  orange: [
    { label: 'Energy', value: '1.13 kcal' },
    { label: 'Protein', value: '0 g' },
    { label: 'Carbohydrate', value: '0.37 g' },
    { label: 'Total Sugars', value: '0 g' },
    { label: 'Added Sugars', value: '0 g' },
    { label: 'Total Fat', value: '0 g' },
    { label: 'Sodium', value: '120 mg' },
    { label: 'Caffeine', value: '52 mg', highlight: true },
    { label: 'L-Theanine', value: '50 mg', highlight: true },
    { label: 'Vitamin C', value: '80 mg' },
    { label: 'Vitamin B6', value: '1.3 mg' },
    { label: 'Vitamin B12', value: '2.4 µg' },
  ],
  mango: [
    { label: 'Energy', value: '1 kcal' },
    { label: 'Protein', value: '0 g' },
    { label: 'Carbohydrate', value: '0.33 g' },
    { label: 'Total Sugars', value: '0 g' },
    { label: 'Added Sugars', value: '0 g' },
    { label: 'Total Fat', value: '0 g' },
    { label: 'Sodium', value: '120 mg' },
    { label: 'Caffeine', value: '50 mg', highlight: true },
    { label: 'L-Theanine', value: '50 mg', highlight: true },
    { label: 'Vitamin C', value: '80 mg' },
    { label: 'Vitamin B6', value: '1.3 mg' },
    { label: 'Vitamin B12', value: '2.4 µg' },
  ],
}

/** Short per-flavour energy figure for chips and tickers. */
export const KCAL: Record<FlavorId, string> = {
  orange: '1.13 kcal',
  mango: '1 kcal',
}

export type Pack = {
  id: PackId
  name: string
  label: string
  price: number
  was: number
  perCan: number
  off: string
  ship: boolean
  best: boolean
}

export const PACKS: Array<Pack> = [
  { id: '6', name: '6-Pack', label: 'Starter', price: 594, was: 720, perCan: 99, off: 'Save 18%', ship: false, best: false },
  { id: '12', name: '12-Pack', label: 'Monthly', price: 1111, was: 1440, perCan: 93, off: 'Save 23%', ship: true, best: true },
  { id: '24', name: '24-Pack', label: 'Stock Up', price: 1999, was: 2880, perCan: 83, off: 'Save 31%', ship: true, best: false },
]

/** Real Shopify cart permalinks (variant:qty) — 2 flavours × 3 packs. */
const VARIANTS: Record<FlavorId, Record<PackId, string>> = {
  orange: { '6': '43574790619342', '12': '43574790652110', '24': '43574790684878' },
  mango: { '6': '43574790717646', '12': '43574790750414', '24': '43574790783182' },
}

export function buyUrl(flavor: FlavorId, pack: PackId): string {
  return `${STORE_URL}/cart/${VARIANTS[flavor][pack]}:1`
}

/**
 * The Shopify variants carry no artwork, so the cart drawer falls back to the
 * local can render. Variant titles read like "Orange Coffee / 12-Pack".
 */
export function flavorImageFor(variantTitle: string): string | null {
  if (/orange/i.test(variantTitle)) return FLAVORS.orange.img
  if (/mango/i.test(variantTitle)) return FLAVORS.mango.img
  return null
}

/**
 * The Storefront API addresses variants by global id rather than the legacy
 * numeric id the cart permalinks use, so build one from the other.
 */
export function variantGid(flavor: FlavorId, pack: PackId): string {
  return `gid://shopify/ProductVariant/${VARIANTS[flavor][pack]}`
}
