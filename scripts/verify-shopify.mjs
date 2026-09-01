/**
 * Checks the six variant ids in src/data/shop.ts against the live Storefront
 * API, and compares Shopify's prices with the hardcoded pack prices.
 *
 *   node --env-file=.env.local scripts/verify-shopify.mjs
 *
 * Reads the token from the environment and never prints it.
 */

const DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN ?? 'nerv-2782.myshopify.com'
const TOKEN = process.env.VITE_SHOPIFY_STOREFRONT_TOKEN
const VERSION = process.env.VITE_SHOPIFY_API_VERSION ?? '2026-07'

if (!TOKEN) {
  console.error('VITE_SHOPIFY_STOREFRONT_TOKEN is not set.')
  console.error('Run: node --env-file=.env.local scripts/verify-shopify.mjs')
  process.exit(1)
}

// Mirrors VARIANTS, PACKS and FLAVORS in src/data/shop.ts.
const VARIANTS = {
  orange: { 6: '43574790619342', 12: '43574790652110', 24: '43574790684878' },
  mango: { 6: '43574790717646', 12: '43574790750414', 24: '43574790783182' },
}
const EXPECTED = { 6: 594, 12: 1111, 24: 1999 }
// Shopify's variant title is what buyers read in the cart drawer and on the
// hosted checkout, so it has to agree with the name the site shows.
const FLAVOR_NAMES = { orange: 'Orange Coffee', mango: 'Mango Chilli' }

const ids = Object.values(VARIANTS).flatMap((packs) =>
  Object.values(packs).map((id) => `gid://shopify/ProductVariant/${id}`),
)

const res = await fetch(`https://${DOMAIN}/api/${VERSION}/graphql.json`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': TOKEN,
  },
  body: JSON.stringify({
    query: `
      query Variants($ids: [ID!]!) {
        nodes(ids: $ids) {
          ... on ProductVariant {
            id
            title
            availableForSale
            price { amount currencyCode }
            product { title }
          }
        }
      }
    `,
    variables: { ids },
  }),
})

if (!res.ok) {
  console.error(`Shopify returned ${res.status} ${res.statusText}`)
  process.exit(1)
}

const json = await res.json()
if (json.errors?.length) {
  console.error('GraphQL errors:')
  for (const e of json.errors) console.error(`  - ${e.message}`)
  process.exit(1)
}

let problems = 0
let i = 0
for (const [flavor, packs] of Object.entries(VARIANTS)) {
  for (const pack of Object.keys(packs)) {
    const node = json.data.nodes[i++]
    const label = `${flavor.padEnd(6)} ${String(pack).padStart(2)}-pack`

    if (!node) {
      console.log(`✗ ${label}  NOT FOUND (id ${packs[pack]})`)
      problems++
      continue
    }

    const price = Number(node.price.amount)
    const expected = EXPECTED[pack]
    const priceOk = price === expected
    const stockOk = node.availableForSale

    const expectedTitle = `${FLAVOR_NAMES[flavor]} / ${pack}-Pack`
    const titleOk = node.title === expectedTitle
    if (!priceOk || !stockOk || !titleOk) problems++

    const flags = [
      priceOk ? null : `PRICE differs — site says ₹${expected}`,
      stockOk ? null : 'OUT OF STOCK',
      titleOk ? null : `NAME differs — site says "${expectedTitle}"`,
    ].filter(Boolean)

    console.log(
      `${flags.length ? '✗' : '✓'} ${label}  ${node.product.title} / ${node.title}` +
        `  ${node.price.currencyCode} ${price}` +
        (flags.length ? `  ← ${flags.join('; ')}` : ''),
    )
  }
}

console.log(
  problems === 0
    ? '\nAll six variants match the site.'
    : `\n${problems} problem(s) found. Fix them in Shopify, or update ` +
        `VARIANTS / PACKS / FLAVORS in src/data/shop.ts to match.`,
)
process.exit(problems === 0 ? 0 : 1)
