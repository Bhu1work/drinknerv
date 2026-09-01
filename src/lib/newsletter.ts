import { createServerFn } from '@tanstack/react-start'

/**
 * Newsletter signup.
 *
 * Deliberately uses the *Admin* API rather than the Storefront API: Storefront
 * `customerCreate` demands a password and produces a login-capable account,
 * which the site does not want. The Admin mutation records marketing consent
 * with no account attached.
 *
 * Apps created in Shopify's Dev Dashboard have no static Admin token — you
 * exchange the client id/secret for one via the client credentials grant, and
 * it lives for 24 hours. So the credentials sit in server-only env vars (no
 * `VITE_` prefix, so Vite never bundles them) and the token is fetched on
 * demand and cached in memory until shortly before it expires.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type NewsletterResult = { ok: boolean; message: string }

function shopDomain(): string {
  return process.env.VITE_SHOPIFY_STORE_DOMAIN ?? 'nerv-2782.myshopify.com'
}

function apiVersion(): string {
  return process.env.VITE_SHOPIFY_API_VERSION ?? '2026-07'
}

/**
 * Cached per warm server instance. A cold start just fetches a new token —
 * cheap, and far simpler than persisting one.
 */
let cachedToken: { value: string; expiresAt: number } | null = null

async function getAdminToken(): Promise<string | null> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.value

  const clientId = process.env.SHOPIFY_CLIENT_ID
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    console.error('SHOPIFY_CLIENT_ID / SHOPIFY_CLIENT_SECRET are not set.')
    return null
  }

  const res = await fetch(`https://${shopDomain()}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  })

  if (!res.ok) {
    console.error(`Token exchange failed: ${res.status} ${res.statusText}`)
    return null
  }

  const json = (await res.json()) as { access_token?: string; expires_in?: number }
  if (!json.access_token) {
    console.error('Token exchange returned no access_token.')
    return null
  }

  // Retire the token five minutes early so a request in flight never straddles
  // the expiry boundary.
  const ttl = (json.expires_in ?? 86399) - 300
  cachedToken = { value: json.access_token, expiresAt: Date.now() + ttl * 1000 }
  return cachedToken.value
}

const SUBSCRIBE_MUTATION = `
  mutation SubscribeCustomer($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer { id }
      userErrors { field message }
    }
  }
`

type AdminResponse = {
  data?: {
    customerCreate: {
      customer: { id: string } | null
      userErrors: Array<{ field: Array<string> | null; message: string }>
    }
  }
  errors?: Array<{ message: string }>
}

async function callAdmin(token: string, email: string): Promise<Response> {
  return fetch(`https://${shopDomain()}/admin/api/${apiVersion()}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({
      query: SUBSCRIBE_MUTATION,
      variables: {
        input: {
          email,
          emailMarketingConsent: {
            marketingState: 'SUBSCRIBED',
            marketingOptInLevel: 'SINGLE_OPT_IN',
            consentUpdatedAt: new Date().toISOString(),
          },
          tags: ['newsletter', 'drinknerv.com'],
        },
      },
    }),
  })
}

export const subscribeToNewsletter = createServerFn({ method: 'POST' })
  .validator((email: string) => {
    const trimmed = email.trim().toLowerCase()
    if (!EMAIL_RE.test(trimmed)) throw new Error('Enter a valid email address.')
    return trimmed
  })
  .handler(async ({ data: email }): Promise<NewsletterResult> => {
    const token = await getAdminToken()
    if (!token) return { ok: false, message: 'Signup is unavailable right now.' }

    let res: Response
    try {
      res = await callAdmin(token, email)
      // A cached token can be revoked before its stated expiry; drop it and
      // retry once with a fresh one.
      if (res.status === 401) {
        cachedToken = null
        const fresh = await getAdminToken()
        if (!fresh) return { ok: false, message: 'Signup is unavailable right now.' }
        res = await callAdmin(fresh, email)
      }
    } catch {
      return { ok: false, message: 'Could not reach the server. Try again.' }
    }

    if (!res.ok) {
      console.error(`Shopify Admin API returned ${res.status} ${res.statusText}`)
      return { ok: false, message: 'Signup is unavailable right now.' }
    }

    const json = (await res.json()) as AdminResponse

    if (json.errors?.length) {
      console.error('Shopify Admin API error:', json.errors)
      return { ok: false, message: 'Signup is unavailable right now.' }
    }

    const userErrors = json.data?.customerCreate.userErrors ?? []
    if (userErrors.length) {
      // An existing subscriber is a success from the visitor's point of view.
      const taken = userErrors.some((e) => /taken|already/i.test(e.message))
      if (taken) return { ok: true, message: "You're already on the list." }
      return { ok: false, message: userErrors[0].message }
    }

    return { ok: true, message: "You're in. Watch your inbox." }
  })
