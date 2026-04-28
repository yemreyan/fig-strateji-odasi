import { buildCountryRoadmap } from "./roadmap";

describe("country roadmap", () => {
  it("creates an ordered month-by-month action plan", () => {
    const roadmap = buildCountryRoadmap({
      countryCode: "EGY",
      countryName: "Egypt",
      continent: "UAG",
      status: "persuadable",
      primaryNeed: "development",
      relationshipStrength: 74
    });

    expect(roadmap).toHaveLength(6);
    expect(roadmap[0].month).toBe("Ay 1");
    expect(roadmap[0].focus).toMatch(/dinleme|listening/i);
    expect(roadmap[5].focus).toMatch(/taahhüt|commitment/i);
  });
});
