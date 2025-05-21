import 'dotenv/config.ts';

export const CONFIG = {
  NETWORK: 'testnet',
  POLLING_INTERVAL_MS: parseInt('10000'),
  CONTRACT: {
    packageId: '0x0f469d7065b24a50373f6e4f5e7230b6e5260a3d1ef1c864d3f08a2fc52668c7',
  },
} as const;