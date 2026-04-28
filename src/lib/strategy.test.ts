import {
  buildContinentSummaries,
  deriveCountryStrategy,
  rankCountriesByUrgency
} from "./strategy";
import { federationSeeds } from "../data/federationSeeds";

describe("strategy utilities", () => {
  it("builds continent summaries from federation data", () => {
    const summaries = buildContinentSummaries(federationSeeds);

    expect(summaries.EG.total).toBe(50);
    expect(summaries.AGU.total).toBe(38);
    expect(summaries.UAG.total).toBe(36);
    expect(summaries.PAGU.total).toBe(32);
    expect(summaries.OGU.total).toBe(8);
  });

  it("derives a strategy profile with country-specific messages", () => {
    const profile = deriveCountryStrategy("JPN", federationSeeds);

    expect(profile?.countryCode).toBe("JPN");
    expect(profile?.status).toBe("watch");
    expect(profile?.primaryNeed).toBe("continuity");
    expect(profile?.messaging[0]).toMatch(/istikrar/i);
  });

  it("merges federation leadership and FIG role intelligence into country profiles", () => {
    const turkey = deriveCountryStrategy("TUR", federationSeeds);
    const egypt = deriveCountryStrategy("EGY", federationSeeds);

    expect(turkey?.president).toBeTruthy();
    expect(turkey?.sources.some((source) => /FIG Directory/i.test(source.title))).toBe(
      true
    );
    expect(
      turkey?.researchTasks.some((task) => task.status === "verified")
    ).toBe(true);
    expect(turkey?.figRoles.some((role) => role.role === "FIG Vice-President")).toBe(
      true
    );
    expect(turkey?.decisionArchitecture.length).toBeGreaterThan(2);
    expect(turkey?.entryChannels.length).toBeGreaterThan(1);
    expect(turkey?.redLines.length).toBeGreaterThan(1);
    expect(egypt?.figRoles.some((role) => /TC President/.test(role.role))).toBe(
      true
    );
    expect(egypt?.disciplines.length).toBeGreaterThan(3);
  });

  it("ranks open and high-need countries ahead of stable supporters", () => {
    const ranked = rankCountriesByUrgency(federationSeeds);

    expect(ranked[0].status).toBe("persuadable");
    expect(ranked[0].priorityScore).toBeGreaterThan(ranked[10].priorityScore);
  });
});
