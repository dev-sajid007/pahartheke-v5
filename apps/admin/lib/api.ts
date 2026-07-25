const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://backend:5000/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

export async function apiFetch(path: string, options?: RequestInit) {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { headers, ...options });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Request failed");
  return json;
}

export async function getLandingPage(pageName: string) {
  const json = await apiFetch(`/landing-page?pageName=${pageName}`);
  return json.data?.[0] || null;
}

export async function upsertLandingPage(pageName: string, payload: Record<string, unknown>) {
  const existing = await getLandingPage(pageName);
  if (existing) {
    return apiFetch(`/landing-page/${existing._id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }
  return apiFetch("/landing-page", {
    method: "POST",
    body: JSON.stringify({ pageName, ...payload }),
  });
}

export async function getSectionByType(pageName: string, sectionType: string) {
  const page = await getLandingPage(pageName);
  if (!page) return null;
  return page.sections?.find((s: { sectionType: string }) => s.sectionType === sectionType) || null;
}

export async function upsertSection(pageName: string, sectionType: string, data: Record<string, unknown>) {
  const page = await getLandingPage(pageName);
  if (page) {
    const sections: Array<Record<string, unknown>> = page.sections || [];
    const idx = sections.findIndex((s: Record<string, unknown>) => s.sectionType === sectionType);
    const newSection = { sectionType, ...data };
    if (idx >= 0) sections[idx] = newSection;
    else sections.push(newSection);
    return apiFetch(`/landing-page/${page._id}`, {
      method: "PUT",
      body: JSON.stringify({ ...page, sections }),
    });
  }
  return apiFetch("/landing-page", {
    method: "POST",
    body: JSON.stringify({
      pageName,
      sections: [{ sectionType, ...data }],
    }),
  });
}
