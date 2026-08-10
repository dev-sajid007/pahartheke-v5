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

const DEFAULT_DELIVERY_OPTIONS = [
  { id: 1, value: "Dhaka", label: "Inside Dhaka", cost: 65 },
  { id: 2, value: "Outside", label: "Outside Dhaka", cost: 150 },
];

export async function getDeliveryOptions() {
  try {
    const section = await getSection("home", "delivery_charges");
    if (section?.content) {
      const parsed = JSON.parse(section.content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure each zone has a stable "value" key for city selection
        return parsed.map((z, i) => ({
          ...z,
          value: z.value || z.label?.replace(/\s+/g, "_") || `zone_${i}`,
        }));
      }
    }
  } catch (_) { }
  return DEFAULT_DELIVERY_OPTIONS;
}

