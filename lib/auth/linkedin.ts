import { LinkedIn } from 'arctic';

export const linkedin = new LinkedIn(
  process.env.LINKEDIN_CLIENT_ID,
  process.env.LINKEDIN_CLIENT_SECRET,
  `${process.env.DOMAIN}/api/auth/callback/linkedin`,
);
