import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const from = process.argv[2] ?? "2024-01-01";
const to = process.argv[3] ?? "2028-12-31";
const apiUrl = new URL("https://www.gymnastics.sport/api/sportevents/");
const hiddenEventsUrl = "https://www.gymnastics.sport/site/events/hiddenEvents.txt";
const outputPath = path.join(projectRoot, "src/data/figEventSummaries.json");

apiUrl.searchParams.set("from", from);
apiUrl.searchParams.set("to", to);

const fetchJson = async (url) => {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "Codex FIG Sync/1.0"
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return response.json();
};

const fetchText = async (url) => {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Codex FIG Sync/1.0"
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return response.text();
};

const parseHiddenEvents = (value) =>
  new Set(
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => Number(item))
      .filter((item) => Number.isFinite(item))
  );

const isFlagshipEvent = (event) => {
  const title = event.title.toUpperCase();
  return (
    title.includes("WORLD CHAMPIONSHIPS") ||
    title.includes("WORLD CUP") ||
    title.includes("WORLD CHALLENGE CUP") ||
    title.includes("CONTINENTAL CHAMPIONSHIPS") ||
    title.includes("ASIAN CHAMPIONSHIPS") ||
    title.includes("EUROPEAN CHAMPIONSHIPS") ||
    title.includes("AFRICAN CHAMPIONSHIPS") ||
    title.includes("PAN AMERICAN") ||
    title.includes("PACIFIC RIM")
  );
};

const today = new Date();
const todayKey = today.toISOString().slice(0, 10);
const recentCutoff = new Date(today);
recentCutoff.setFullYear(recentCutoff.getFullYear() - 2);
const recentCutoffKey = recentCutoff.toISOString().slice(0, 10);

const hiddenText = await fetchText(hiddenEventsUrl).catch(() => "");
const hiddenEvents = parseHiddenEvents(hiddenText);
const response = await fetchJson(apiUrl);
const rawEvents = Array.isArray(response.data) ? response.data : [];

const normalizedEvents = rawEvents
  .filter((event) => !hiddenEvents.has(event.id))
  .filter((event) => event.city?.country?.code)
  .filter((event) => event.status !== "canceled")
  .map((event) => ({
    id: event.id,
    title: event.title,
    startDate: event.startevent,
    endDate: event.endevent,
    city: event.city.name,
    countryCode: event.city.country.code,
    status: event.status,
    disciplines: (event.disciplines ?? []).map((discipline) => discipline.code),
    hasResults: Boolean(event.hasresults),
    sourceUrl: `https://www.gymnastics.sport/site/events/detail.php?id=${event.id}&type=sport`
  }));

const groupedByCountry = normalizedEvents.reduce((accumulator, event) => {
  if (!accumulator[event.countryCode]) {
    accumulator[event.countryCode] = [];
  }

  accumulator[event.countryCode].push(event);
  return accumulator;
}, {});

const summaries = Object.entries(groupedByCountry)
  .map(([countryCode, events]) => {
    const sortedEvents = [...events].sort((left, right) =>
      left.startDate.localeCompare(right.startDate)
    );
    const recentHighlights = sortedEvents
      .filter((event) => event.endDate < todayKey && event.endDate >= recentCutoffKey)
      .sort((left, right) => right.endDate.localeCompare(left.endDate))
      .slice(0, 3);
    const upcomingHighlights = sortedEvents
      .filter((event) => event.endDate >= todayKey)
      .slice(0, 3);
    const flagshipEventCount = events.filter(isFlagshipEvent).length;
    const recentEventCount = events.filter(
      (event) => event.endDate < todayKey && event.endDate >= recentCutoffKey
    ).length;
    const upcomingEventCount = events.filter((event) => event.endDate >= todayKey).length;
    const eventScore = Math.min(
      100,
      Math.round(
        Math.min(events.length, 8) * 6 +
          recentEventCount * 7 +
          upcomingEventCount * 10 +
          flagshipEventCount * 8
      )
    );

    return {
      countryCode,
      totalEvents: events.length,
      recentEventCount,
      upcomingEventCount,
      flagshipEventCount,
      eventScore,
      recentHighlights,
      upcomingHighlights
    };
  })
  .sort((left, right) => left.countryCode.localeCompare(right.countryCode));

await fs.writeFile(outputPath, `${JSON.stringify(summaries, null, 2)}\n`);

console.log(
  `FIG etkinlik ozeti guncellendi: ${normalizedEvents.length} kayittan ${summaries.length} ulke ozeti yazildi (${from} -> ${to}).`
);
