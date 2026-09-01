/**
 * Confirms the Dev Dashboard app credentials work and carry write_customers,
 * by doing the same client credentials exchange the newsletter uses.
 *
 *   node --env-file=.env.local scripts/verify-admin.mjs
 *
 * Reads the secret from the environment and never prints it or the token.
 */

const DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN ?? 'nerv-2782.myshopify.com'
const VERSION = process.env.VITE_SHOPIFY_API_VERSION ?? '2026-07'
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('SHOPIFY_CLIENT_ID / SHOPIFY_CLIENT_SECRET are not set.')
  console.error('Run: node --env-file=.env.local scripts/verify-admin.mjs')
  process.exit(1)
}

const tokenRes = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  }),
})

if (!tokenRes.ok) {
  console.error(`✗ Token exchange failed: ${tokenRes.status} ${tokenRes.statusText}`)
  console.error('  Check the client id/secret, and that the app is installed on the store.')
  process.exit(1)
}

const { access_token, expires_in, scope } = await tokenRes.json()
if (!access_token) {
  console.error('✗ Token exchange returned no access_token.')
  process.exit(1)
}

const scopes = (scope ?? '').split(',').filter(Boolean)
console.log(`✓ Token exchange OK (valid ${Math.round((expires_in ?? 0) / 3600)}h)`)
console.log(`  Scopes: ${scopes.join(', ') || '(none reported)'}`)

const hasWriteCustomers = scopes.includes('write_customers')
console.log(
  hasWriteCustomers
    ? '✓ write_customers granted'
    : '✗ write_customers MISSING — add it to the app version and re-release',
)

// A harmless read that still requires customer permission.
const probe = await fetch(`https://${DOMAIN}/admin/api/${VERSION}/graphql.json`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': access_token,
  },
  body: JSON.stringify({ query: '{ shop { name myshopifyDomain } }' }),
})

const probeJson = await probe.json()
if (probeJson.errors?.length) {
  console.error('✗ Admin API call failed:')
  for (const e of probeJson.errors) console.error(`    - ${e.message}`)
  process.exit(1)
}

console.log(`✓ Admin API reachable — connected to "${probeJson.data.shop.name}"`)
process.exit(hasWriteCustomers ? 0 : 1)
