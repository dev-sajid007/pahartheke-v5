async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

export async function getLandingPage(pageName = "home") {
  const res = await fetch(`/api/landing-page?pageName=${pageName}`, { cache: "no-store" });
  const json = await handleResponse(res);
  if (!json.success) return null;
  return json.data?.[0] || null;
}

export async function getSection(pageName, sectionType) {
  const page = await getLandingPage(pageName);
  if (!page) return null;
  return page.sections?.find((s) => s.sectionType === sectionType) || null;
}
