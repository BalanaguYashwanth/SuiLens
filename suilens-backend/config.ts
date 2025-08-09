import 'dotenv/config';

export const CONFIG = {
  NETWORK: 'mainnet',
  POLLING_INTERVAL_MS: parseInt('10000'),
  CONTRACT: {
    packageId: '0xefe8b36d5b2e43728cc323298626b83177803521d195cfb11e15b910e892fddf',
  },
} as const;