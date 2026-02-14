export const FILM_TYPE = {
  film: 0,
  series: 1,
} satisfies Record<string, number>;

export const COUNTRY_CODE_TO_NAME = {
  US: "United States",
  GB: "United Kingdom",
  FR: "France",
  DE: "Germany",
  IT: "Italy",
  TR: "Turkey",
  IN: "India",
  JP: "Japan",
  KR: "South Korea",
  HK: "Hong Kong",
  TW: "Taiwan",
  MY: "Malaysia",
  SG: "Singapore",
  AU: "Australia",
  CA: "Canada",
  MX: "Mexico",
  BR: "Brazil",
  AR: "Argentina",
  ZA: "South Africa",
} satisfies Record<string, string>;

export const COUNTRY_CODES = Object.keys(COUNTRY_CODE_TO_NAME);
