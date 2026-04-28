import type {
  ContinentCode,
  ContinentSummary,
  FederationSeed,
  SupportStatus
} from "../types";

export const buildContinentSummaries = (countries: FederationSeed[]) => {
  const summaries = {} as Record<ContinentCode, ContinentSummary>;

  for (const code of ["EG", "AGU", "UAG", "PAGU", "OGU"] as ContinentCode[]) {
    const bucket = countries.filter((country) => country.continent === code);
    const countStatus = (status: SupportStatus) =>
      bucket.filter((country) => country.status === status).length;

    summaries[code] = {
      total: bucket.length,
      supporter: countStatus("supporter"),
      watch: countStatus("watch"),
      persuadable: countStatus("persuadable"),
      resistant: countStatus("resistant"),
      averageRelationship:
        bucket.reduce((sum, country) => sum + country.relationshipStrength, 0) /
        bucket.length
    };
  }

  return summaries;
};

export const deriveCountryStrategy = (
  countryCode: string,
  countries: FederationSeed[]
) => {
  return countries.find((country) => country.countryCode === countryCode);
};

export const rankCountriesByUrgency = (countries: FederationSeed[]) => {
  return [...countries].sort((left, right) => right.priorityScore - left.priorityScore);
};

export const statusTone = (status: SupportStatus) => {
  switch (status) {
    case "supporter":
      return {
        label: "Destekçi",
        color: "#2ed8a3",
        soft: "rgba(46, 216, 163, 0.14)"
      };
    case "watch":
      return {
        label: "İzle",
        color: "#f6b34a",
        soft: "rgba(246, 179, 74, 0.14)"
      };
    case "persuadable":
      return {
        label: "İkna edilebilir",
        color: "#ff6b57",
        soft: "rgba(255, 107, 87, 0.14)"
      };
    case "resistant":
      return {
        label: "Dirençli",
        color: "#7a7f90",
        soft: "rgba(122, 127, 144, 0.18)"
      };
  }
};
