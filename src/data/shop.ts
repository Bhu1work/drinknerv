import canOrange from '~/assets/can-orange.png'
import canMango from '~/assets/can-mango.png'

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
    protocol: 'Protocol 001',
    tags: 'Infused with Caffeine + L-Theanine',
    img: canOrange,
    tint: 'rgba(217,213,35,0.10)',
  },
  mango: {
    name: 'Mango Chilli',
    protocol: 'Protocol 002',
    tags: 'Tropical Heat / Cayenne',
    img: canMango,
    tint: 'rgba(192,57,43,0.12)',
  },
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
