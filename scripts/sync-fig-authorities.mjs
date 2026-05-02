import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const indexUrl = "https://www.gymnastics.sport/site/pages/viewauthority.php";
const outputPath = path.join(projectRoot, "src/data/authorityRoles.json");
const supplementPath = path.join(projectRoot, "src/data/authoritySupplements.json");

const normalize = (value) =>
  value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();

const groupTypeFromHeading = (heading) => {
  if (heading.includes("Commission")) {
    return "commission";
  }

  if (heading.includes("Working Group")) {
    return "working_group";
  }

  if (heading.includes("Honorary")) {
    return "honorary";
  }

  return "authority";
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

const parseCountryCode = (value) => {
  const match = value.match(/\(([A-Z]{3})\)\s*$/);
  return match?.[1] ?? "";
};

const parsePersonName = (value) =>
  normalize(value.replace(/\(([A-Z]{3})\)\s*$/, ""));

const dedupeRecords = (records) => {
  const unique = new Map();

  for (const record of records) {
    const key = [record.role, record.name, record.countryCode, record.term].join("|");
    if (!unique.has(key)) {
      unique.set(key, record);
    }
  }

  return [...unique.values()];
};

const indexHtml = await fetchText(indexUrl);
const indexDom = new JSDOM(indexHtml);
const indexDocument = indexDom.window.document;

const positions = [...indexDocument.querySelectorAll(".panel-group > .panel.panel-primary")]
  .flatMap((panel) => {
    const groupHeading = normalize(panel.querySelector(".panel-heading h4")?.textContent ?? "");
    const groupType = groupTypeFromHeading(groupHeading);

    return [...panel.querySelectorAll(".panel-body a[href*='viewauthority.php?positionID=']")]
      .map((link) => {
        const href = link.getAttribute("href") ?? "";
        const url = new URL(href, indexUrl);
        const positionId = Number(url.searchParams.get("positionID"));

        if (!Number.isFinite(positionId)) {
          return null;
        }

        return {
          groupHeading,
          groupType,
          groupName: normalize(link.textContent ?? ""),
          positionId,
          url: url.toString()
        };
      })
      .filter(Boolean);
  });

const officialRecords = [];

for (const position of positions) {
  const detailHtml = await fetchText(position.url);
  const detailDom = new JSDOM(detailHtml);
  const detailDocument = detailDom.window.document;
  const rows = [...detailDocument.querySelectorAll(".row-striped .row-title")];

  for (const row of rows) {
    const columns = [...row.children].map((column) =>
      normalize(column.textContent ?? "")
    );
    const role = columns[1] ?? position.groupName;
    const personCell = columns[2] ?? "";
    const term = columns[3] ?? "";
    const countryCode = parseCountryCode(personCell);
    const name = parsePersonName(personCell);

    if (!name || !countryCode) {
      continue;
    }

    officialRecords.push({
      role,
      name,
      countryCode,
      term,
      groupName: position.groupName,
      groupType: position.groupType,
      positionId: position.positionId,
      source: "official",
      sourceUrl: position.url
    });
  }
}

const supplements = JSON.parse(await fs.readFile(supplementPath, "utf8"));
const combined = dedupeRecords([...officialRecords, ...supplements]).sort((left, right) =>
  left.countryCode.localeCompare(right.countryCode) ||
  left.role.localeCompare(right.role) ||
  left.name.localeCompare(right.name)
);

await fs.writeFile(outputPath, `${JSON.stringify(combined, null, 2)}\n`);

console.log(
  `FIG otorite verisi guncellendi: ${officialRecords.length} resmi kayit, ${supplements.length} ek kayit, toplam ${combined.length}.`
);
