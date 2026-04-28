import { buildMapNodes } from "./map";
import type { FederationSeed } from "../types";

const baseCountry = (overrides: Partial<FederationSeed>): FederationSeed => ({
  countryCode: "TST",
  countryName: "Testland",
  federationName: "Test Federation",
  continent: "EG",
  president: "Test President",
  secretaryGeneral: "Test Secretary",
  disciplines: ["MAG"],
  city: "Test City",
  country: "Test Country",
  email: "test@example.com",
  website: "https://example.com",
  status: "watch",
  primaryNeed: "governance",
  needTags: ["test"],
  relationshipStrength: 50,
  influence: 50,
  federationTier: "B",
  figRoles: [],
  figPowerIndex: 50,
  technicalCommitteeStatus: "None",
  judgesInfluence: "Medium",
  politicalPower: "Medium",
  diplomaticAllies: [],
  frictionPoints: [],
  achievements: [],
  languages: ["English"],
  athleteCapacity: "Medium",
  facilities: "Medium",
  facilityScore: 60,
  strategyPath: [],
  visualSignals: [],
  researchStatus: "mixed",
  decisionArchitecture: [],
  entryChannels: [],
  persuasionPayload: [],
  redLines: [],
  congressScenario: [],
  expectations: [],
  relationshipNetwork: [],
  athleteBaseEstimate: "Test",
  nationalTeamHighlights: [],
  medalHighlights: [],
  countryRanking: "Test",
  hostedEvents: [],
  sources: [],
  researchTasks: [],
  contactLog: [],
  visualDeck: [],
  notes: "Test",
  messaging: [],
  monthlyHooks: [],
  priorityScore: 90,
  coordinates: [0, 0],
  ...overrides
});

describe("map node builder", () => {
  it("clusters nearby countries at low zoom", () => {
    const countries = [
      baseCountry({ countryCode: "AAA", countryName: "A", coordinates: [10, 10] }),
      baseCountry({ countryCode: "BBB", countryName: "B", coordinates: [11, 10.3] }),
      baseCountry({ countryCode: "CCC", countryName: "C", coordinates: [70, 10] })
    ];

    const nodes = buildMapNodes(countries, 1.2, "AAA");

    expect(nodes).toHaveLength(2);
    expect(nodes.some((node) => node.kind === "cluster" && node.count === 2)).toBe(
      true
    );
  });

  it("separates nearby countries at high zoom with adjusted coordinates", () => {
    const countries = [
      baseCountry({ countryCode: "AAA", countryName: "A", coordinates: [10, 10] }),
      baseCountry({ countryCode: "BBB", countryName: "B", coordinates: [10.4, 10.2] })
    ];

    const nodes = buildMapNodes(countries, 3.4, "AAA");
    const countryNodes = nodes.filter((node) => node.kind === "country");

    expect(countryNodes).toHaveLength(2);
    expect(countryNodes[0].coordinates).not.toEqual(countryNodes[1].coordinates);
    expect(countryNodes.find((node) => node.country.countryCode === "AAA")?.labelVisible).toBe(
      true
    );
  });
});
