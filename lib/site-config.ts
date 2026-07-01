// Single source of truth for values that must stay consistent across every
// page (Footer, Contact, etc). If you already have a `useData()` context,
// replace the constant below with a re-export from that context so it's
// structurally impossible for pages to drift apart again — e.g.:
//
//   export const useLocation = () => useData().location;
//
// Until that's wired up, this constant is the one place to edit.

export const SITE_LOCATION = {
    short: "CHD_IND",        // compact/telemetry label
    full: "CHANDIGARH, INDIA", // full label
    timeZone: "Asia/Kolkata" as const,
};