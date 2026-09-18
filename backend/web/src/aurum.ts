export interface ProductProof {
  rating: number;
  sales: number;
  retention: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  margin: number;
  badge: string;
  proof: ProductProof;
  features: string[];
}

export interface ProductsResponse {
  products: Product[];
}

export interface LeadPayload {
  email: string;
  source?: string;
  message?: string;
}

export interface LeadResponse {
  id: string;
  accepted: boolean;
  email: string;
  received_at: string;
}

export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(normalizeEmail(email));
}

export function scoreProduct(product: Product): number {
  const dollars = product.price / 100;
  return (
    (product.proof.rating * Math.log1p(product.proof.sales) * product.margin) /
    Math.sqrt(dollars + 1)
  );
}

export function rankProducts(products: Product[]): Product[] {
  return [...products].sort((a, b) => scoreProduct(b) - scoreProduct(a));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isProductProof(value: unknown): value is ProductProof {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.rating === "number" &&
    typeof value.sales === "number" &&
    typeof value.retention === "number"
  );
}

function isProduct(value: unknown): value is Product {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.category === "string" &&
    typeof value.price === "number" &&
    typeof value.margin === "number" &&
    typeof value.badge === "string" &&
    isProductProof(value.proof) &&
    Array.isArray(value.features) &&
    value.features.every((feature) => typeof feature === "string")
  );
}

export async function getProducts(baseUrl = "/api"): Promise<Result<Product[]>> {
  try {
    const response = await fetch(`${baseUrl}/products`, {
      headers: { accept: "application/json" },
      cache: "no-store"
    });

    if (!response.ok) {
      return { ok: false, error: `HTTP ${response.status}` };
    }

    const body: unknown = await response.json();

    if (
      isRecord(body) &&
      Array.isArray(body.products) &&
      body.products.every(isProduct)
    ) {
      return { ok: true, value: body.products };
    }

    return { ok: false, error: "Invalid product payload" };
  } catch {
    return { ok: false, error: "Network failure" };
  }
}

export async function submitLead(
  payload: LeadPayload,
  baseUrl = "/api"
): Promise<Result<LeadResponse>> {
  const email = normalizeEmail(payload.email);

  if (!isValidEmail(email)) {
    return { ok: false, error: "Invalid email" };
  }

  try {
    const response = await fetch(`${baseUrl}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        email,
        source: payload.source ?? "typescript-client"
      })
    });

    if (response.status === 409) {
      return { ok: false, error: "Duplicate lead" };
    }

    if (!response.ok) {
      return { ok: false, error: `HTTP ${response.status}` };
    }

    const body: unknown = await response.json();

    if (
      isRecord(body) &&
      typeof body.id === "string" &&
      typeof body.accepted === "boolean" &&
      typeof body.email === "string" &&
      typeof body.received_at === "string"
    ) {
      return { ok: true, value: body as LeadResponse };
    }

    return { ok: false, error: "Invalid lead response" };
  } catch {
    return { ok: false, error: "Network failure" };
  }
}
