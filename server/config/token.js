export const REFRESH_TOKEN_TTL =
  Number(process.env.REFRESH_TOKEN_TTL_DAYS||14) * 24 * 60 * 60 * 1000;
