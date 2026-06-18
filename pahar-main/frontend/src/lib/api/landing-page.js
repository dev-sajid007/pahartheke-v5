export async function getLandingPage(pageName = "home") {
  const res = await fetch(`/api/landing-page?pageName=${pageName}`, {
    cache: "no-store",
  });
  const json = await res.json();
  if (!json.success) return null;
  return json.data?.[0] || null;
}

export async function getSection(pageName, sectionType) {
  const page = await getLandingPage(pageName);
  if (!page) return null;
  return page.sections?.find((s) => s.sectionType === sectionType) || null;
}
