#!/usr/bin/env node
import { readFileSync } from 'node:fs';
const auth=readFileSync('src/lib/auth/server.ts','utf8');
const errors=[];
if(!auth.includes('trustedOrigins'))errors.push('trustedOrigins is not configured');
if(!auth.includes('defaultCookieAttributes'))errors.push('secure cookie attributes are missing');
if(!auth.includes('session_token'))errors.push('explicit session cookie name is missing');
if(!auth.includes('genericOAuth'))errors.push('OAuth plugin boundary missing');
const email=readFileSync('src/lib/auth/email-password.ts','utf8');
if(!email.includes('emailAndPasswordEnabled = true'))console.log('[auth-config] email/password intentionally disabled');
if(errors.length){console.error('[auth-config] FAIL\n'+errors.join('\n'));process.exit(1)}
if(process.env.REQUIRE_PASSWORD_RESET==='true' && !auth.includes('sendResetPassword'))throw new Error('REQUIRE_PASSWORD_RESET=true but Better Auth reset delivery is not configured');
if(process.env.REQUIRE_EMAIL_VERIFICATION==='true' && !auth.includes('sendVerificationEmail'))throw new Error('REQUIRE_EMAIL_VERIFICATION=true but verification delivery is not configured');
console.log('[auth-config] PASS — session cookies, trusted origins and OAuth boundary are configured. Password reset/email verification become hard gates only when delivery is provisioned.');
