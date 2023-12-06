import { beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

import type { PrismaClient } from '@prisma/client';

beforeEach(() => {
  mockReset(db);
});

const db = mockDeep<PrismaClient>();
export default db;
