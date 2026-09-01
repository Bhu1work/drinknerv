/**
 * Minimal Storefront API client.
 *
 * The Storefront access token is a *public* credential — Shopify designs it to
 * be readable in browser code — so it rides on `VITE_` and is bundled. It is
 * still kept out of git; see `.env.example`. The Admin token is a different
 * animal and never appears in this file.
 */

const DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN as string | undefined
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string | undefined
const VERSION =
  (import.meta.env.VITE_SHOPIFY_API_VERSION as string | undefined) ?? '2026-07'

/** True when the storefront is wired up; lets the UI degrade instead of throw. */
export const storefrontConfigured = Boolean(DOMAIN && TOKEN)

export class ShopifyError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ShopifyError'
  }
}

type GraphQLResponse<T> = {
  data?: T
  errors?: Array<{ message: string }>
}

export async function storefront<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  if (!DOMAIN || !TOKEN) {
    throw new ShopifyError(
      'Shopify storefront is not configured — set VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_TOKEN.',
    )
  }

  let res: Response
  try {
    res = await fetch(`https://${DOMAIN}/api/${VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    })
  } catch {
    throw new ShopifyError('Could not reach Shopify. Check your connection.')
  }

  if (!res.ok) {
    throw new ShopifyError(`Shopify returned ${res.status} ${res.statusText}.`)
  }

  const json = (await res.json()) as GraphQLResponse<T>

  if (json.errors?.length) {
    throw new ShopifyError(json.errors.map((e) => e.message).join('; '))
  }
  if (!json.data) {
    throw new ShopifyError('Shopify returned an empty response.')
  }

  return json.data
}

/**
 * Cart mutations return `userErrors` alongside their payload — a 200 response
 * with a populated `userErrors` is still a failure, so unwrap both together.
 */
export function unwrap<T>(
  payload: { userErrors?: Array<{ message: string }> } & Record<string, unknown>,
  key: string,
): T {
  if (payload.userErrors?.length) {
    throw new ShopifyError(payload.userErrors.map((e) => e.message).join('; '))
  }
  return payload[key] as T
}
