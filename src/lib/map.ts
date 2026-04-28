import type { FederationSeed, SupportStatus } from "../types";

type CountryWithCoordinates = FederationSeed & {
  coordinates: [number, number];
};

export type MapCountryNode = {
  kind: "country";
  id: string;
  country: CountryWithCoordinates;
  coordinates: [number, number];
  radius: number;
  labelVisible: boolean;
};

export type MapClusterNode = {
  kind: "cluster";
  id: string;
  countries: CountryWithCoordinates[];
  coordinates: [number, number];
  count: number;
  status: SupportStatus;
};

export type MapNode = MapCountryNode | MapClusterNode;

const hasCoordinates = (
  country: FederationSeed
): country is CountryWithCoordinates => Array.isArray(country.coordinates);

const clusterKeyFrom = (
  coordinates: [number, number],
  lonStep: number,
  latStep: number
) => {
  const [lon, lat] = coordinates;
  return `${Math.round(lon / lonStep)}:${Math.round(lat / latStep)}`;
};

const averageCoordinates = (countries: CountryWithCoordinates[]): [number, number] => {
  const sum = countries.reduce(
    (accumulator, country) => {
      accumulator[0] += country.coordinates[0];
      accumulator[1] += country.coordinates[1];
      return accumulator;
    },
    [0, 0]
  );

  return [sum[0] / countries.length, sum[1] / countries.length];
};

const dominantStatus = (countries: CountryWithCoordinates[]): SupportStatus => {
  const priority: SupportStatus[] = ["persuadable", "watch", "supporter", "resistant"];
  return (
    priority.find((status) => countries.some((country) => country.status === status)) ??
    "watch"
  );
};

const buildCountryNode = (
  country: CountryWithCoordinates,
  coordinates: [number, number],
  zoom: number,
  selectedCode: string
): MapCountryNode => ({
  kind: "country",
  id: country.countryCode,
  country,
  coordinates,
  radius: Math.max(4, 4 + country.priorityScore / 50 - zoom * 0.75),
  labelVisible: country.countryCode === selectedCode || zoom >= 2.9
});

export const buildMapNodes = (
  countries: FederationSeed[],
  zoom: number,
  selectedCode: string
): MapNode[] => {
  const withCoordinates = countries.filter(hasCoordinates);

  if (zoom < 2.5) {
    const lonStep = zoom < 1.6 ? 18 : 10;
    const latStep = zoom < 1.6 ? 12 : 7;
    const buckets = new Map<string, CountryWithCoordinates[]>();

    for (const country of withCoordinates) {
      const key = clusterKeyFrom(country.coordinates, lonStep, latStep);
      const bucket = buckets.get(key) ?? [];
      bucket.push(country);
      buckets.set(key, bucket);
    }

    return Array.from(buckets.entries()).map(([key, bucket]) => {
      if (bucket.length === 1) {
        return buildCountryNode(bucket[0], bucket[0].coordinates, zoom, selectedCode);
      }

      return {
        kind: "cluster",
        id: `cluster-${key}`,
        countries: bucket,
        coordinates: averageCoordinates(bucket),
        count: bucket.length,
        status: dominantStatus(bucket)
      };
    });
  }

  const lonStep = zoom < 3.4 ? 5 : 3.5;
  const latStep = zoom < 3.4 ? 3.8 : 2.6;
  const buckets = new Map<string, CountryWithCoordinates[]>();

  for (const country of withCoordinates) {
    const key = clusterKeyFrom(country.coordinates, lonStep, latStep);
    const bucket = buckets.get(key) ?? [];
    bucket.push(country);
    buckets.set(key, bucket);
  }

  const nodes: MapNode[] = [];

  for (const bucket of buckets.values()) {
    if (bucket.length === 1) {
      nodes.push(buildCountryNode(bucket[0], bucket[0].coordinates, zoom, selectedCode));
      continue;
    }

    const centroid = averageCoordinates(bucket);
    const distance = zoom < 3.4 ? 1.8 : 1.15;

    bucket
      .slice()
      .sort((left, right) => right.priorityScore - left.priorityScore)
      .forEach((country, index) => {
        const ring = Math.floor(index / 6);
        const angle = (Math.PI * 2 * index) / Math.min(bucket.length, 6);
        const radiusMultiplier = 1 + ring * 0.55;
        const coordinates: [number, number] = [
          centroid[0] + Math.cos(angle) * distance * radiusMultiplier,
          centroid[1] + Math.sin(angle) * distance * 0.65 * radiusMultiplier
        ];

        nodes.push(buildCountryNode(country, coordinates, zoom, selectedCode));
      });

  }

  return nodes;
};
