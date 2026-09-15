#!/usr/bin/env node
/** Real Better Auth -> Prisma -> PostgreSQL signup/signin/session smoke test. */
import { randomUUID } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { auth } from '../src/lib/auth/server.ts';

const prisma = new PrismaClient();
const id = randomUUID();
const email = `prisma-auth-${id}@example.invalid`;
const password = 'V43SmokePassword123!';
let userId;
try {
  const signup = await auth.api.signUpEmail({
    body: { name: 'V43 Prisma Smoke', email, password },
  });
  if (!signup?.user?.id) throw new Error(`signup did not return a user: ${JSON.stringify(signup)}`);
  userId = signup.user.id;

  const storedUser = await prisma.user.findUnique({ where: { id: userId } });
  const storedAccount = await prisma.account.findFirst({ where: { userId } });
  const storedSession = await prisma.session.findFirst({ where: { userId } });
  if (!storedUser || !storedAccount || !storedSession) {
    throw new Error('signup did not persist user/account/session rows through Prisma');
  }

  const signIn = await auth.api.signInEmail({
    body: { email, password },
    asResponse: true,
  });
  if (!signIn.ok) throw new Error(`signin failed with HTTP ${signIn.status}`);
  const cookie = signIn.headers.get('set-cookie');
  if (!cookie) throw new Error('signin succeeded but no session cookie was returned');

  console.log('[prisma-auth-smoke] PASS — real Better Auth signup -> Prisma rows -> signin -> session cookie flow.');
} catch (err) {
  console.error('[prisma-auth-smoke] FAIL:', err?.message || err);
  process.exitCode = 1;
} finally {
  if (userId) {
    await prisma.session.deleteMany({ where: { userId } });
    await prisma.account.deleteMany({ where: { userId } });
    await prisma.user.deleteMany({ where: { id: userId } });
  }
  await prisma.$disconnect();
}
