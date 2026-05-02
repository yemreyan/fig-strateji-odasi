import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const inputPath = process.argv[2] ?? "/tmp/fig_viewfederation.html";
const outputPath = path.join(projectRoot, "src/data/federationDirectory.json");

const normalize = (value) =>
  value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();

const splitCityCountry = (value) => {
  const normalized = normalize(value);
  if (!normalized.includes("/")) {
    return {
      city: normalized,
      country: ""
    };
  }

  const [city, country] = normalized.split("/").map((item) => item.trim());
  return { city, country };
};

const buildPersonName = (row) => {
  if (!row) {
    return "";
  }

  const cells = row.querySelectorAll(".small");
  const surname = normalize(cells[1]?.textContent ?? "");
  const givenName = normalize(cells[2]?.textContent ?? "");
  return normalize(`${givenName} ${surname}`);
};

const html = await fs.readFile(inputPath, "utf8");
const dom = new JSDOM(html);
const { document } = dom.window;

const panels = [...document.querySelectorAll(".panel-group > .panel.panel-success")];

const records = panels
  .map((panel) => {
    const title = panel.querySelector(".panel-title");
    const code = normalize(title?.querySelector("kbd")?.textContent ?? "");
    const federationName = normalize(title?.querySelector("strong")?.textContent ?? "");
    const titleText = normalize(title?.textContent ?? "");
    const titleMeta = titleText.replace(`${code} ${federationName}`, "").trim();
    const [continent = "", memberType = ""] = titleMeta
      .split("-")
      .map((item) => item.trim());

    if (memberType.toLowerCase() !== "affiliate" || code === "WWW") {
      return null;
    }

    const body = panel.querySelector(".panel-body");
    const plainRows = [...body.querySelectorAll(".row:not(.row-striped)")];
    const stripedRows = [...body.querySelectorAll(".row-striped")];

    const disciplineText = normalize(plainRows[0]?.textContent ?? "");
    const disciplines = disciplineText
      .split("»")
      .map((item) => item.trim())
      .filter(Boolean);

    const contactRows = plainRows.slice(1, 4).map((row) => {
      const left = normalize(row.querySelector(".col-sm-7.small")?.textContent ?? "");
      const right = normalize(row.querySelector(".col-sm-5.small")?.textContent ?? "");
      return { left, right };
    });

    const location = splitCityCountry(contactRows[2]?.left ?? "");

    const presidentRow = stripedRows.find((row) =>
      normalize(row.querySelector(".col-sm-5.small")?.textContent ?? "")
        .toLowerCase()
        .includes("president")
    );
    const secretaryRow = stripedRows.find((row) =>
      normalize(row.querySelector(".col-sm-5.small")?.textContent ?? "")
        .toLowerCase()
        .includes("secretary general")
    );

    return {
      countryCode: code,
      federationName,
      continent,
      disciplines,
      addressLine1: contactRows[0]?.left ?? "",
      addressLine2: contactRows[1]?.left ?? "",
      city: location.city,
      country: location.country,
      phone: contactRows[0]?.right ?? "",
      email: contactRows[2]?.right ?? "",
      website: contactRows[1]?.right ?? "",
      president: buildPersonName(presidentRow),
      secretaryGeneral: buildPersonName(secretaryRow)
    };
  })
  .filter(Boolean);

await fs.writeFile(outputPath, `${JSON.stringify(records, null, 2)}\n`);

console.log(`FIG rehberi guncellendi: ${records.length} affiliate kaydi yazildi.`);
